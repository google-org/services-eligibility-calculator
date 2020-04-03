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
 * Application wide settings.
 *
 * @ORM\Entity
 * @ApiResource(
 *     attributes={"order"={"name": "ASC"}},
 *     normalizationContext={"groups"={"settings:read"}},
 *     denormalizationContext={"groups"={"settings:write"}},
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
class Setting
{
    /**
     * @var string The unique name of this setting.
     *
     * @ORM\Column(type="string", length=191, unique=true)
     * @ORM\Id
     */
    public $name;

    /**
     * @var string The value of this setting.
     *
     * @ORM\Column(type="string")
     */
    public $value;
}
