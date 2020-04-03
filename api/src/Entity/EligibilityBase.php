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
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Baseclass for the eligibility profile for a service.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * @ORM\MappedSuperclass
 */
class EligibilityBase implements Translatable
{
    /**
     * @var \Ramsey\Uuid\Uuid The unique id of this eligibility profile
     *
     * @ORM\Id
     * @ORM\Column(type="uuid_binary", unique=true, nullable=false)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    private $id;

    /**
     * @var smallint The index of this profile within the service.
     *
     * @ORM\Column(type="smallint", nullable=true)
     */
    public $profileIndex;

    /**
     * @var smallint The minimum age eligibility for this profile (if any).
     *
     * @ORM\Column(type="smallint", nullable=true)
     */
    public $ageMin;

    /**
     * @var smallint The maximum age eligibility for this profile (if any).
     *
     * @ORM\Column(type="smallint", nullable=true)
     */
    public $ageMax;

    /**
     * @var smallint The income eligibility for this profile as a percent of Area Median Income.
     *
     * @ORM\Column(type="smallint", nullable=true)
     */
    public $percentAMI;

    /**
     * @var smallint The income eligibility for this profile as a percent of Federal Poverty Level.
     *
     * @ORM\Column(type="smallint", nullable=true)
     */
    public $percentFPL;

    /**
     * @var simple_array The income eligibility for this profile as custom amounts.
     * The value at each index is the maximum income for a family of size (index + 1).
     *
     * @ORM\Column(type="simple_array", nullable=true)
     */
    public $incomeMaxima;

    /**
     * @var text The fees for this profile (as an unvalidated string).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     * @Assert\Length(max = 600)
     */
    public $fees;

    /**
     * @var boolean If true, applicants must have proof of residency.
     *
     * @ORM\Column(type="boolean", nullable=true)
     */
    public $residentRequired;

    /**
     * @var boolean If true, applicants must have proof of citizenship.
     *
     * @ORM\Column(type="boolean", nullable=true)
     */
    public $citizenRequired;

    /**
     * @var text Other eligibility requirements for this profile (if any).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     * @Assert\Length(max = 1000)
     */
    public $other;

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
