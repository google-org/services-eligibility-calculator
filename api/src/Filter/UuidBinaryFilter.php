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


namespace App\Filter;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\AbstractContextAwareFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use Doctrine\ORM\QueryBuilder;
use Ramsey\Uuid\Uuid;

/**
 * This UuidBinaryFilter can be used to filter entities with a field of type
 * uuid_binary to those that match a string UUID query parameter.
 * It will throw an error if the provided query cannot be converted to a UUID.
 *
 * Custom Doctrine ORM Filters documentation:
 * https://api-platform.com/docs/core/filters/#creating-custom-doctrine-orm-filters
 */
final class UuidBinaryFilter extends AbstractContextAwareFilter
{
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        // Don't apply filter to order or page
        if (
            !$this->isPropertyEnabled($property, $resourceClass) ||
            !$this->isPropertyMapped($property, $resourceClass)
        ) {
            return;
        }

        // Convert query from string to binary UUID
        $binary_value = Uuid::fromString((string) $value)->getBytes();

        // Generate a unique parameter name to avoid collisions with other filters
        $parameterName = $queryNameGenerator->generateParameterName($property);

        // Build the query
        $alias = $queryBuilder->getRootAliases()[0];
        $queryBuilder
            ->andWhere(sprintf('%s.%s = :%s', $alias, $property, $parameterName))
            ->setParameter($parameterName, $binary_value);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description["$property"] = [
                'property' => $property,
                'type' => 'string',
                'required' => false,
                'swagger' => [
                    'description' => 'Filter a binary UUID.',
                    'name' => 'UUID Binary Filter',
                    'type' => 'string',
                ],
            ];
        }

        return $description;
    }
}
