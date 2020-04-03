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


namespace App\DataProviders;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Service;
use App\Entity\ServiceActivity;
use App\Entity\ServiceDraft;
use Doctrine\ORM\EntityManagerInterface;

final class ServiceActivityDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ServiceActivity::class === $resourceClass;
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?ServiceActivity
    {
        /** @var Service $service */
        $service = $this->entityManager->find(get_class(new Service()), $id);
        if (!$service) {
            /** @var ServiceDraft $service */
            $draft = $this->entityManager->find(get_class(new ServiceDraft()), $id);
            if (!$draft) {
                return null;
            }

            return ServiceActivityDataProvider::getServiceDraftActivity($draft);
        }

        return ServiceActivityDataProvider::getServiceActivity($service);
    }

    public static function getServiceActivity(Service $service): ServiceActivity
    {
        /** @var ServiceActivity $activity */
        $activity = new ServiceActivity();
        $activity->serviceId = (string) $service->getId();
        $activity->name = $service->name;
        $activity->numEdits = $service->numEdits;
        $activity->numPublished = !!$service->history ? count($service->history) : 0;
        $activity->isArchived = !!$service->archivedDateTime;
        $activity->hasDraft = !!$service->draft;
        return $activity;
    }

    public static function getServiceDraftActivity(ServiceDraft $draft): ServiceActivity
    {
        /** @var ServiceActivity $activity */
        $activity = new ServiceActivity();
        $activity->serviceId = (string) !!$draft->service ? $draft->service->getId() : $draft->getId();
        $activity->name = $draft->name;
        $activity->numEdits = $draft->numEdits;
        $activity->numPublished = !!$draft->service ? !!$draft->service->history ? count($draft->service->history) : 0 : 0;
        $activity->isArchived = false;
        $activity->hasDraft = true;
        return $activity;
    }
}
