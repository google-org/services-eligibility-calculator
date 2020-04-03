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

// api/src/Doctrine/CurrentUserExtension.php

namespace App\Security;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\ServiceDraft;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;

/**
 * This extension ensures service drafts are only viewable by the original creator or someone whom
 * the draft has been shared with.
 */
final class ServiceDraftExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (ServiceDraft::class !== $resourceClass || $this->security->isGranted('ROLE_ADMIN') || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];

        // This sub query retrieves all users this draft has been shared with.
        $subQuery = $queryBuilder->getEntityManager()->createQueryBuilder();
        $subQuery
            ->select('share.sharedWithUsername')
            ->from('App\Entity\ServiceDraftShare', 'share')
            ->where(sprintf('share.draftService = %s.id', $rootAlias));

        // Add a where clause that filters out any drafts not created by this user
        // or shared with this user.
        $queryBuilder
            ->andWhere(sprintf(
                '(%s.createdBy = :current_user OR %s)',
                $rootAlias,
                $queryBuilder->expr()->in(":current_user", $subQuery->getDQL())));
        $queryBuilder->setParameter('current_user', $user);
    }
}
