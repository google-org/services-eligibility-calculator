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
 *     normalizationContext={"groups"={"user-activity:read"}},
 *     collectionOperations={
 *         "get"={"security"="is_granted('ROLE_ADMIN')"}
 *     },
 *     itemOperations={
 *         "get"={"security"="is_granted('ROLE_ADMIN')"}
 *     }
 * )
 */
class UserActivity
{
    /**
     * @ApiProperty(identifier=true)
     *
     * @var string The username for which the activity is for.
     */
    public $username;

    /**
     * @var string The user's display name.
     */
    public $displayName;

    /**
     * @var string The # of times this user has logged in.
     */
    public $numLogins = 0;

    /**
     * @var string The date of the last login.
     */
    public $lastLogin;

    /**
     * @var string The number of times this user has saved a draft.
     */
    public $numEdits = 0;

    /**
     * @var int The number of times this user has published a service.
     */
    public $numPublished;

    /**
     * @var int The number of times this user has archived a service.
     */
    public $numArchived;
}
