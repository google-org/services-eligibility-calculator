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


namespace App\EventListeners;

use App\Entity\ServiceDraft;
use App\Entity\User;
use Doctrine\ORM\Event\OnFlushEventArgs;
use Gedmo\Translatable\Entity\Translation;

class ServiceChangeListener
{
    private function recordUserEdit($entity, $entityManager)
    {
        if (!$entity instanceof ServiceDraft) {
            return;
        }

        $modifiedBy = $entity->lastModifiedBy;

        if (!empty($modifiedBy)) {
            /** @var User $user */
            $user = $entityManager->getRepository(User::class)->findOneBy(['username' => $modifiedBy]);

            if (!$user) {
                $user = new User();
                $user->username = $modifiedBy;
                $user->displayName = $modifiedBy;
                $user->logins = 0;
                $user->numEdits = 0;
            }

            $user->numEdits++;

            $entityManager->persist($user);

            $userClassMetadata = $entityManager->getClassMetadata(User::class);
            $unitOfWork = $entityManager->getUnitOfWork();
            $unitOfWork->computeChangeSet($userClassMetadata, $user);
        }
    }

    // Deletes entries in translations table with null values (so will fall back to default-language values)
    private function removeNullTranslations($entity, $entityManager)
    {
        if (!$entity instanceof Translation) {
            return;
        }
        if ($entity->getContent() === null) {
            $entityManager->remove($entity);
            $translationClassMetadata = $entityManager->getClassMetadata(Translation::class);
            $unitOfWork = $entityManager->getUnitOfWork();
            $unitOfWork->computeChangeSet($translationClassMetadata, $entity);
        }
    }

    public function onFlush(OnFlushEventArgs $eventArgs)
    {
        $entityManager = $eventArgs->getEntityManager();
        $unitOfWork = $entityManager->getUnitOfWork();

        foreach ($unitOfWork->getScheduledEntityInsertions() as $entity) {
            $this->recordUserEdit($entity, $entityManager);
            $this->removeNullTranslations($entity, $entityManager);
        }

        foreach ($unitOfWork->getScheduledEntityUpdates() as $entity) {
            $this->recordUserEdit($entity, $entityManager);
            $this->removeNullTranslations($entity, $entityManager);
        }
    }
}
