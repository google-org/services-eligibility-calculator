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

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 */
class User
{
    /**
     * @ORM\Column(type="string", length=191, unique=true)
     * @ORM\Id
     */
    public $username;

    /**
     * @ORM\Column(type="string", length=255)
     */
    public $displayName;

    /**
     * The # of times this user has logged in.
     *
     * @ORM\Column(type="integer")
     */
    public $logins = 0;

    /**
     * The date of last login.
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $lastLogin;

    /**
     * The # of times this user has saved a draft.
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    public $numEdits = 0;
}
