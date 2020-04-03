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
use App\Entity\User;
use App\Entity\UserActivity;
use Doctrine\ORM\EntityManagerInterface;

final class UserActivityDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
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

    public function getItem(string $resourceClass, $username, string $operationName = null, array $context = []): ?UserActivity
    {
        /** @var User $service */
        $user = $this->entityManager->find(get_class(new User()), $username);
        if (!$user) {
            return null;
        }

        return UserActivityDataProvider::getUserActivity($user, $this->entityManager);
    }

    public static function getUserActivity(User $user, EntityManagerInterface $em): UserActivity
    {
        /** @var UserActivity $activity */
        $activity = new UserActivity();
        $activity->username = $user->username;
        $activity->displayName = $user->displayName;
        $activity->numLogins = $user->logins;
        $activity->lastLogin = $user->lastLogin;
        $activity->numEdits = $user->numEdits;

        $dql = 'select count(h.id) as count from ' .
            'App\Entity\ServiceHistory h ' .
            'where h.lastModifiedBy = :username';
        $query = $em->createQuery($dql);
        $query->setParameter('username', $user->username);
        $result = $query->getResult();
        $activity->numPublished = intval($result[0]['count']);

        $dql = 'select count(s.id) as count from ' .
            'App\Entity\Service s ' .
            'where s.archivedBy = :username';
        $query = $em->createQuery($dql);
        $query->setParameter('username', $user->username);
        $result = $query->getResult();
        $activity->numArchived = intval($result[0]['count']);

        return $activity;
    }
}
