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
use App\DataProviders\UserActivityDataProvider;
use App\Entity\User;
use App\Entity\UserActivity;
use Doctrine\ORM\EntityManagerInterface;

/**
 * Returns a collection of activity for all users.
 */
final class UserActivityCollectionDataProvider implements CollectionDataProviderInterface, RestrictedDataProviderInterface
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return UserActivity::class === $resourceClass;
    }

    public function getCollection(string $resourceClass, string $operationName = null): \Generator
    {
        /** @var User[] $users */
        $users = $this->entityManager->getRepository(User::class)->findBy([], ['displayName' => 'ASC']);

        foreach ($users as $user) {
            /** @var UserActivity $activity */
            $activity = UserActivityDataProvider::getUserActivity($user, $this->entityManager);
            yield $activity;
        }
    }
}
