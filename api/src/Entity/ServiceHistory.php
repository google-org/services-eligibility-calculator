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

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Entity\ServiceBase;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * A service change.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * TODO: Don't allow unauthenticated GET requests.
 *
 * @ORM\Entity
 * @ApiResource(
 *     normalizationContext={"groups"={"service_history:read"}},
 *     collectionOperations={"get"={"security"="is_fully_authenticated()"}},
 *     itemOperations={"get"={"security"="is_fully_authenticated()"}},
 *     attributes={"order"={"lastModifiedDateTime": "ASC"}}
 * )
 * @ApiFilter(
 *     OrderFilter::class,
 *     properties={
 *        "name": "ASC",
 *        "description": "ASC",
 *        "department": "ASC",
 *        "lastModifiedBy": "ASC",
 *        "lastModifiedDateTime": "ASC"
 *     }
 * )
 */
class ServiceHistory extends ServiceBase
{
    /**
     * @var \Ramsey\Uuid\Uuid The unique id of this service history version.
     *
     * @ORM\Id
     * @ORM\Column(type="uuid_binary", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    public $id;

    /**
     * The service that was changed.
     *
     * @ORM\ManyToOne(targetEntity="Service", inversedBy="histories")
     */
    public $service;

    /**
     * @var int The revision number for this service change.
     *
     * @ORM\Column(type="integer", options={"unsigned": true})
     * @Groups({"service:read"})
     * */
    public $revision;

    /**
     * @var ArrayCollection The eligibility profiles for this service.
     *
     * Keep in sync with eligibilityProfiles in Service and ServiceDraft
     *
     * @ORM\OneToMany(
     *     targetEntity="ServiceHistoryEligibility",
     *     mappedBy="serviceHistory",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true)
     * @ORM\OrderBy({"profileIndex" = "ASC"})
     */
    public $eligibilityProfiles;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ServiceHistoryShare",
     *     mappedBy="serviceHistory"
     * )
     */
    public $shares;

    public function getId()
    {
        return $this->id;
    }
}
