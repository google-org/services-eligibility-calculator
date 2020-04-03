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
use App\Controller\PublishServiceController;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * A service draft.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * @ORM\Entity
 * @UniqueEntity("service")
 * @ApiResource(
 *     attributes={"order"={"name": "ASC"}},
 *     normalizationContext={"groups"={"service_draft:read"}},
 *     denormalizationContext={"groups"={"service_draft:write"}},
 *     collectionOperations={
 *         "get"={"security"="is_fully_authenticated()"},
 *         "post"={"security"="is_fully_authenticated()"},
 *     },
 *     itemOperations={
 *         "get"={"security"="is_fully_authenticated()"},
 *         "put"={"security"="is_fully_authenticated()"},
 *         "delete"={"security"="is_fully_authenticated()"},
 *         "publish"={
 *              "method"="PUT",
 *              "path"="/service_drafts/{id}/publish",
 *              "controller"=PublishServiceController::class,
 *              "security"="is_fully_authenticated()"
 *          }
 *     },
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
class ServiceDraft extends ServiceBase
{
    /**
     * @var \Ramsey\Uuid\Uuid The unique id of this service draft
     *
     * @ORM\Id
     * @ORM\Column(type="uuid_binary", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity="Service", inversedBy="draft")
     */
    public $service;

    /**
     * @var ArrayCollection The eligibility profiles for this service.
     *
     * Keep in sync with eligibilityProfiles in Service and ServiceHistory
     *
     * @ORM\OneToMany(
     *     targetEntity="ServiceDraftEligibility",
     *     mappedBy="draftService",
     *     cascade={"persist", "remove"},
     *     orphanRemoval=true)
     * @ORM\OrderBy({"profileIndex" = "ASC"})
     */
    public $eligibilityProfiles;

    /**
     * @var string The user who initially created the draft.
     *
     * @ORM\Column(type="text")
     */
    public $createdBy;

    /**
     * @ORM\OneToMany(
     *     targetEntity="ServiceDraftShare",
     *     mappedBy="draftService",
     *     cascade={"remove"},
     *     orphanRemoval=true
     * )
     */
    public $shares;

    public function getId()
    {
        return $this->id;
    }
}
