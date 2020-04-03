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

use Carbon\Carbon;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Gedmo\Translatable\Translatable;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Baseclass for a service.
 *
 * When adding or removing fields be sure to update the serialization configuration.
 * The serialization configs can be found in the config/serialization/ directory.
 *
 * @ORM\MappedSuperclass
 */
class ServiceBase implements Translatable
{
    /**
     * @var text The service name.
     *
     * @Assert\NotBlank
     * @Gedmo\Translatable
     * @ORM\Column(type="text")
     */
    public $name;

    /**
     * @var text A short service description.
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $description;

    /**
     * @var text Additional details about the service.
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $details;

    /**
     * @var boolean Whether or not this service is always accepting applications.
     *
     * If true, applicationWindowStart and applicationWindowEnd should be null.
     *
     * @ORM\Column(type="boolean", nullable=true)
     */
    public $alwaysAcceptApplications;

    /**
     * The department this service is run by.
     *
     * @ORM\ManyToOne(targetEntity="Department")
     */
    public $department;

    /**
     * @var \DateTime The date the application window opens/opened.
     *
     * @ORM\Column(type="date", nullable=true)
     */
    public $applicationWindowStart;

    /**
     * @var \DateTime The date the application window closes/closed.
     *
     * @ORM\Column(type="date", nullable=true)
     */
    public $applicationWindowEnd;

    /**
     * @var ArrayCollection The interests this service relates to.
     *
     * @ORM\ManyToMany(targetEntity="Interest")
     * @ORM\OrderBy({"name" = "ASC"})
     */
    public $interests;

    /**
     * @var text Address for applying in person (if applicable).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationAddress;

    /**
     * @var text Walk-in/appointment hours for applying in person (if applicable).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationHours;

    /**
     * @var text Phone number for applying by phone (if applicable).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationPhone;

    /**
     * @var text Additional information to display with phone number
     * for applying by phone (if applicable).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationPhoneOther;

    /**
     * @var text Email address for applying by email (if applicable).
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $contactEmail;

    /**
     * @var text Website to learn more about the service.
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationOnline;

    /**
     * @var simple_array Web addresses where applicants can apply.
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="simple_array", nullable=true)
     */
    public $applicationWebAddresses;

    /**
     * @var text Documentation needed in addition to application.
     *
     * @Gedmo\Translatable
     * @ORM\Column(type="text", nullable=true)
     */
    public $applicationDocuments;

    /**
     * @var \DateTime The date/time this service was last modified.
     *
     * @ORM\Column(type="datetime", nullable=true)
     */
    public $lastModifiedDateTime;

    /**
     * @var text The username of the user who last modified this service.
     *
     * @ORM\Column(type="text", nullable=true)
     */
    public $lastModifiedBy;

    /**
     * @var text The display name of the user who last modified this service.
     *
     * @ORM\Column(type="text", nullable=true)
     */
    public $lastModifiedByDisplayName;

    /**
     * The # of times this service has been edited (i.e. saved as a draft).
     *
     * @ORM\Column(type="integer", nullable=true)
     */
    public $numEdits = 0;

    /**
     * Used locale to override Translation listener`s locale.
     * Should be the language code only (usually two letters).
     *
     * @Gedmo\Locale
     */
    public $locale;

    public function __construct()
    {
        // Set interests and eligibility to empty ArrayCollection, so not null
        $this->interests = new ArrayCollection();
        $this->eligibilityProfiles = new ArrayCollection();
    }

    /**
     * A human readable string indicating how long ago this service was modified.
     * (e.g. '2 hours ago').
     *
     */
    public function getLastModifiedAgo(): string
    {
        if ($this->lastModifiedDateTime != null) {
            return Carbon::instance($this->lastModifiedDateTime)->diffForHumans();
        } else {
            return "";
        }
    }

    /**
     * Set the array of eligibility profiles and a pointer on each back to this service.
     */
    public function setEligibilityProfiles($profiles)
    {
        foreach ($this->eligibilityProfiles as $profile) {
            $profile->setService(null);
        }
        foreach ($profiles as $profile) {
            $profile->setService($this);
        }
        $this->eligibilityProfiles = new ArrayCollection($profiles);
    }
}
