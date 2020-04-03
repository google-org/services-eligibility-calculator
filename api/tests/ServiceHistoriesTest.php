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
use App\Entity\ServiceDraft;
use App\Entity\ServiceHistory;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class ServiceHistoriesTest extends ApiTestCase
{
    // Reloads database between each test. Refresh does not work as it does not persist data within a test.
    use ReloadDatabaseTrait;

    const KNOWN_DRAFT_NAME = 'Food Tax Rebate Program';
    const KNOWN_SERVICE_NAME = 'Senior Center Fitness Discounts';

    // Tests that a history entity is created when a service is published
    public function testGetHistoryForPublishedService(): void
    {
        $draftIri = static::findIriBy(ServiceDraft::class, ['name' => static::KNOWN_DRAFT_NAME]);

        // Publish the draft
        $this->client->request('PUT', $draftIri . '/publish', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Get the published service & check history
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_DRAFT_NAME]);
        $response = $this->client->request('GET', $serviceIri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $history = json_decode($response->getContent())->history;
        $this->assertCount(1, $history);
        $this->assertEquals(1, $history[0]->revision);

        // Update draft
        $this->client->request('PUT', $draftIri, [
            'json' => ['description' => 'Something new'],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Publish again
        $this->client->request('PUT', $draftIri . '/publish', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Get the published service & check history
        $response = $this->client->request('GET', $serviceIri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $history = json_decode($response->getContent())->history;
        $this->assertCount(2, $history);
        $this->assertEquals(1, $history[0]->revision);
        $this->assertEquals(2, $history[1]->revision);
    }

    public function testGetHistoryApi(): void
    {
        $serviceHistoryIri = static::findIriBy(ServiceHistory::class, ['revision' => 2]);
        $response = $this->client->request('GET', $serviceHistoryIri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceHistory',
            '@type' => 'ServiceHistory',
            'name' => static::KNOWN_SERVICE_NAME,
        ]);
        $this->assertMatchesResourceItemJsonSchema(ServiceHistory::class);
    }
}
