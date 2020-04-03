<?php
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


namespace App\Handler;

use App\Entity\Service;
use App\Entity\ServiceDraft;
use App\Entity\ServiceEligibility;
use App\Entity\ServiceHistory;
use App\Entity\ServiceHistoryEligibility;
use App\Entity\ServiceHistoryShare;
use App\Entity\ServiceShare;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Gedmo\Translatable\Entity\Translation;

class PublishServiceHandler
{
    const ID_FIELD_NAME = 'id';
    const ELIGIBILITY_FIELD_NAME = 'eligibilityProfiles';
    const SERVICE_FIELD_NAME = 'service';
    const SHARES_FIELD_NAME = 'shares';
    const NUM_EDITS_FIELD_NAME = 'numEdits';
    const WEB_ADDRESSES_FIELD_NAME = 'applicationWebAddresses';
    const LAST_MODIFIED_DATE_TIME_FIELD_NAME = 'lastModifiedDateTime';
    const DEFAULT_LOCALE = 'en';

    private function copyTranslations($from, $to, $entityManager)
    {
        $translationRepository = $entityManager->getRepository(Translation::class);
        // Delete all old translations, to ensure cleared translations are removed
        if ($to->getId()) {
            $deleteQuery = $entityManager->createQueryBuilder()
                ->delete(Translation::class, 't')
                ->where('t.foreignKey = :id')->setParameter('id', $to->getId())
                ->getQuery()->execute();
        }

        // Copy over new translations
        $translations = $translationRepository->findTranslations($from);
        foreach ($translations as $locale => $values) {
            foreach ($values as $key => $value) {
                if ($key == self::WEB_ADDRESSES_FIELD_NAME) {
                    // Need to turn simple_array string back into array
                    $value = explode(',', $value);
                }
                $translationRepository->translate($to, $key, $locale, $value);
            }
        }
    }

    private function copyAndPersistEligibilityProfiles($fromEligibilityProfiles, $to, $toClass, $entityManager)
    {
        foreach ($fromEligibilityProfiles as $fromEligibilityProfile) {
            $toEligibilityProfile = null;
            if ($toClass === Service::class) {
                $toEligibilityProfile = new ServiceEligibility();
                $toEligibilityProfile->service = $to;
            } else if ($toClass === ServiceHistory::class) {
                $toEligibilityProfile = new ServiceHistoryEligibility();
                $toEligibilityProfile->serviceHistory = $to;
            } else {
                throw new Exception("Cannot copy to class: " . $toClass);
            }
            $to->eligibilityProfiles->add($toEligibilityProfile);
            foreach (get_object_vars($fromEligibilityProfile) as $eligibilityKey => $eligibilityValue) {
                if ($eligibilityKey !== self::ID_FIELD_NAME && $eligibilityKey !== self::SERVICE_FIELD_NAME) {
                    $toEligibilityProfile->$eligibilityKey = $eligibilityValue;
                }
            }
            $this->copyTranslations($fromEligibilityProfile, $toEligibilityProfile, $entityManager);
            $entityManager->persist($toEligibilityProfile);
        }
    }

    private function copyAndPersistShares($fromShares, $to, $toClass, $entityManager)
    {
        if (!$to->shares) {
            $to->shares = new ArrayCollection();
        }
        $toShares = array_map(function ($s) {return $s->sharedWithUsername;}, $to->shares->toArray());
        foreach ($fromShares as $fromShare) {
            if (!in_array($fromShare->sharedWithUsername, $toShares)) {
                if ($toClass === Service::class) {
                    $newShare = new ServiceShare();
                    $newShare->service = $to;
                } else if ($toClass === ServiceHistory::class) {
                    $newShare = new ServiceHistoryShare();
                    $newShare->serviceHistory = $to;
                }
                $to->shares->add($newShare);
                foreach (get_object_vars($fromShare) as $shareKey => $shareValue) {
                    $newShare->$shareKey = $shareValue;
                }
                $entityManager->persist($newShare);
            }
        }
    }

    private function copyAndPersistValues($from, $to, $toClass, $entityManager)
    {
        foreach (get_object_vars($from) as $key => $value) {
            if (property_exists($toClass, $key)) {
                if ($key === self::ELIGIBILITY_FIELD_NAME) {
                    $this->copyAndPersistEligibilityProfiles($value, $to, $toClass, $entityManager);
                } else if (($key === self::NUM_EDITS_FIELD_NAME) && ($toClass === Service::class)) {
                    $to->$key = $from->$key + ($to->$key ? $to->$key : 0);
                } else if ($key === self::SHARES_FIELD_NAME) {
                    $this->copyAndPersistShares($from->shares, $to, $toClass, $entityManager);
                } else if ($key !== self::ID_FIELD_NAME && $key !== self::SERVICE_FIELD_NAME) {
                    $to->$key = $value;
                }
            }
        }

        $this->copyTranslations($from, $to, $entityManager);
        $entityManager->persist($to);
    }

    private function persistToHistory(Service $service, ServiceDraft $draft, EntityManager $entityManager)
    {
        $serviceHistory = new ServiceHistory();
        $serviceHistory->service = $service;

        $previousEntries = $entityManager->getRepository(ServiceHistory::class)
            ->findBy(array('service' => $service),
                array(self::LAST_MODIFIED_DATE_TIME_FIELD_NAME => 'DESC'));
        if (empty($previousEntries)) {
            $serviceHistory->revision = 1;
        } else {
            $serviceHistory->revision = $previousEntries[0]->revision + 1;
        }
        // Copy existing shares from service (will copy from draft within copyAndPersistValues)
        if ($service->shares) {
            $this->copyAndPersistShares($service->shares, $serviceHistory, ServiceHistory::class, $entityManager);
        }
        $this->copyAndPersistValues($draft, $serviceHistory, ServiceHistory::class, $entityManager);
    }

    public function handle(ServiceDraft $draft, EntityManager $entityManager)
    {
        $service = null;
        if ($draft->service) {
            $service = $entityManager->getRepository(Service::class)->find($draft->service->id);
            // Clear the eligibility profiles as will rewrite with draft eligiblity profile values
            $service->eligibilityProfiles->clear();
            // Unarchive if previously archived
            $service->archivedDateTime = null;
            $service->archivedBy = null;
            $service->archivedByDisplayName = null;
        } else {
            $service = new Service;
        }

        $draft->locale = self::DEFAULT_LOCALE;
        $entityManager->refresh($draft);
        $this->copyAndPersistValues($draft, $service, Service::class, $entityManager);

        $this->persistToHistory($service, $draft, $entityManager);

        $entityManager->flush();
        $entityManager->refresh($service);
        return $service;
    }
}
