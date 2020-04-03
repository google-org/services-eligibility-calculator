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


namespace App\Tests;

use App\Entity\Service;
use App\Entity\ServiceAnalytics;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class ServiceAnalyticsTest extends ApiTestCase
{
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    const KNOWN_SERVICE_NAME = 'Senior Center Fitness Discounts';

    public function testGetServiceAnalytics(): void
    {
        // Fake a response from Google Analytics with # page views doubling.
        $fakeAnalytics = static::$container->get("Google_Service_AnalyticsReporting");
        $fakeAnalytics->reports->withMetrics(array("PageViews" => array(42, 21)))->withEvents(array("LearnMore" => array(10, 0), "Share" => array(5, 10)));

        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);
        $this->client->request('GET', $serviceIri . "/analytics");

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceAnalytics',
            '@type' => 'ServiceAnalytics',
            '@id' => $serviceIri . "/analytics",
            'metrics' => [
                ['name' => 'LearnMore', 'value' => 10, 'trend' => 0],
                ['name' => 'Share', 'value' => 5, 'trend' => -50],
                ['name' => 'PageViews', 'value' => 42, 'trend' => 100],
            ],
        ]);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(ServiceAnalytics::class);
    }
}
