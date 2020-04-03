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

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * Service activity statistics.
 *
 * @ApiResource(
 *     normalizationContext={"groups"={"service-activity:read"}},
 *     collectionOperations={
 *         "get"={"security"="is_granted('ROLE_ADMIN')"}
 *     },
 *     itemOperations={
 *         "get"={
 *             "path"="services/{id}/activity",
 *             "security"="is_granted('ROLE_ADMIN')"
 *         },
 *     }
 * )
 */
class ServiceActivity
{
    /**
     * @ApiProperty(identifier=true)
     *
     * The service id for which the analytics are for.
     */
    public $serviceId;

    /**
     * @var string The name of the service.
     */
    public $name;

    /**
     * @var int The number of times this service has been edited.
     */
    public $numEdits;

    /**
     * @var int The number of times this service has been published.
     */
    public $numPublished;

    /**
     * @var bool Whether or not the service has been archived.
     */
    public $isArchived;

    /**
     * @var bool Whether or not the service has an active draft.
     */
    public $hasDraft;
}
