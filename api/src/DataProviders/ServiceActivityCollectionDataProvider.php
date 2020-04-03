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

use ApiPlatform\Core\DataProvider\CollectionDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\DataProviders\ServiceActivityDataProvider;
use App\Entity\Service;
use App\Entity\ServiceActivity;
use App\Entity\ServiceDraft;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Returns a collection of activity for all services and draft services.
 */
final class ServiceActivityCollectionDataProvider implements CollectionDataProviderInterface, RestrictedDataProviderInterface
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

    public function getCollection(string $resourceClass, string $operationName = null): \Generator
    {
        /** @var Service[] $services */
        $services = $this->entityManager->getRepository(Service::class)->findBy([], ['name' => 'ASC']);

        foreach ($services as $service) {
            /** @var ServiceActivity $activity */
            $activity = ServiceActivityDataProvider::getServiceActivity($service);
            yield $activity;
        }

        /** @var ServiceDraft[] $services */
        $drafts = $this->entityManager->getRepository(ServiceDraft::class)->findBy([], ['name' => 'ASC']);

        foreach ($drafts as $draft) {
            // Only pass along drafts not associated with an existing service.
            if (!$draft->service) {
                /** @var ServiceActivity $activity */
                $activity = ServiceActivityDataProvider::getServiceDraftActivity($draft);
                yield $activity;
            }
        }
    }
}
