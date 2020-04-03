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
use App\Entity\ServiceActivity;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class ServiceActivityTest extends ApiTestCase
{
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    const KNOWN_SERVICE_NAME = 'Senior Center Fitness Discounts';

    public function testGetAllActivity(): void
    {
        $response = $this->client->request('GET', '/api/service_activities',
            ['headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceActivity',
            '@type' => 'hydra:Collection',
            '@id' => '/api/service_activities',
        ]);

        // 20 services, 1 unpublished draft
        $this->assertCount(21, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(ServiceActivity::class);
    }

    public function testGetServiceActivity(): void
    {
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);
        $this->client->request('GET', $serviceIri . "/activity",
            ['headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceActivity',
            '@type' => 'ServiceActivity',
            '@id' => $serviceIri . "/activity",
            'name' => static::KNOWN_SERVICE_NAME,
            'numEdits' => 0,
            'numPublished' => 1,
            'isArchived' => false,
            'hasDraft' => false,
        ]);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(ServiceActivity::class);
    }

}
