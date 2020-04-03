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
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * A service.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * @ORM\Entity
 * @Gedmo\SoftDeleteable(fieldName="archivedDateTime", timeAware=false)
 * @ApiResource(
 *     attributes={"order"={"name": "ASC"}},
 *     normalizationContext={"groups"={"service:read"}},
 *     denormalizationContext={"groups"={"service:write"}},
 *     collectionOperations={
 *         "get",
 *         "post"={"security"="is_fully_authenticated()"}
 *     },
 *     itemOperations={
 *         "get",
 *         "put"={"security"="is_fully_authenticated()"},
 *         "delete"={"security"="is_fully_authenticated()"},
 *     }
 * )
 * @ApiFilter(
 *     SearchFilter::class,
 *     properties={
 *        "id": "exact",
 *        "name": "ipartial",
 *        "description": "ipartial"
 *     }
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
 * @ApiFilter(ExistsFilter::class, properties={"archivedDateTime"})
 */
class Service extends ServiceBase
{
    /**
     * @var \Ramsey\Uuid\Uuid The unique id of this service.
     *
     * @ORM\Id
     * @ORM\Column(type="uuid_binary", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    public $id;

    /**
     * @var ArrayCollection The eligibility profiles for this service.
     *
     * Keep in sync with eligibilityProfiles in ServiceDraft and ServiceHistory
     *
     * @ORM\OneToMany(
     *     targetEntity="ServiceEligibility",
     *     mappedBy="service",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true)
     * @ORM\OrderBy({"profileIndex" = "ASC"})
     */
    public $eligibilityProfiles;

    /**
     * @ORM\OneToOne(
     *     targetEntity="ServiceDraft",
     *     mappedBy="service"
     * )
     */
    public $draft;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ServiceHistory",
     *     mappedBy="service"
     * )
     * @ORM\OrderBy({"lastModifiedDateTime" = "ASC"})
     */
    public $history;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $archivedDateTime;

    /**
     * @var string The username of the user who archived this service.
     *
     * @ORM\Column(type="text", nullable=true)
     */
    public $archivedBy;

    /**
     * @var string The display name of the user who archived this service.
     *
     * @ORM\Column(type="text", nullable=true)
     */
    public $archivedByDisplayName;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ServiceShare",
     *     mappedBy="service"
     * )
     */
    public $shares;

    public function getId()
    {
        return $this->id;
    }

    /**
     * A human readable string indicating how long ago this service was archived.
     * (e.g. '2 hours ago').
     *
     */
    public function getArchivedAgo(): string
    {
        if ($this->archivedDateTime != null) {
            return Carbon::instance($this->archivedDateTime)->diffForHumans();
        } else {
            return "";
        }
    }
}
