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

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ApiResource(
 *     normalizationContext={"groups"={"service_history_share:read"}},
 *     denormalizationContext={"groups"={"service_history_share:write"}},
 *     collectionOperations={
 *         "post"={"security"="is_fully_authenticated()"},
 *     },
 *     itemOperations={
 *         "get"={"security"="is_fully_authenticated()"},
 *         "delete"={"security"="is_fully_authenticated()"}
 *     }
 * )
 */
class ServiceHistoryShare extends ShareBase
{
    /**
     * The service that was shared.
     *
     * @ORM\ManyToOne(targetEntity="ServiceHistory", inversedBy="shares")
     */
    public $serviceHistory;
}
