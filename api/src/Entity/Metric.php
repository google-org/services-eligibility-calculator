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

/**
 * A single metric, returned as part of the ServiceAnalytics.
 */
class Metric
{
    /**
     * The name of this metric, e.g. 'pageviews'.
     *
     * @var string
     */
    public $name;

    /**
     * The value of this metric over the last 30 days.
     *
     * @var int
     */
    public $value;

    /**
     * The trend of this metric, comparing the last 30 days to
     * the 30 days prior.
     *
     * @var float
     */
    public $trend;
}
