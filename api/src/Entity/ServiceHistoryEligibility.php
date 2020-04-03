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
 * Eligibility profile for a service.
 *
 * @ORM\Entity
 * @ApiResource()
 */
class ServiceHistoryEligibility extends EligibilityBase
{
    /**
     * The service history this eligiblity profile is for.
     *
     * @ORM\ManyToOne(targetEntity="ServiceHistory", inversedBy="eligibilityProfiles")
     */
    public $serviceHistory;

    public function setService($service)
    {
        $this->serviceHistory = $service;
    }
}
