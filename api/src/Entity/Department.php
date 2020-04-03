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
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * A department owning a service.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * @ORM\Entity
 * @ApiResource(
 *     attributes={"order"={"name": "ASC"}},
 *     normalizationContext={"groups"={"department:read"}},
 *     denormalizationContext={"groups"={"department:write"}},
 *     collectionOperations={
 *         "get",
 *         "post"={"security"="is_granted('ROLE_ADMIN')"}
 *     },
 *     itemOperations={
 *         "get",
 *         "put"={"security"="is_granted('ROLE_ADMIN')"},
 *         "delete"={"security"="is_granted('ROLE_ADMIN')"},
 *     }
 * )
 */
class Department implements Translatable
{
    /**
     * @var \Ramsey\Uuid\Uuid The unique id of this department.
     *
     * @ORM\Id
     * @ORM\Column(type="uuid_binary", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $id;

    /**
     * @var string The department name.
     *
     * @Assert\NotBlank
     * @Gedmo\Translatable
     * @ORM\Column(type="text")
     */
    public $name;

    /**
     * Used locale to override Translation listener`s locale.
     * Should be the language code only (usually two letters).
     *
     * @Gedmo\Locale
     */
    public $locale;

    public function getId()
    {
        return $this->id;
    }
}
