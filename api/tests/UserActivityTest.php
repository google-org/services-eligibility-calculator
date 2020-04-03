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
use App\Entity\UserActivity;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class UserActivityTest extends ApiTestCase
{
    use ReloadDatabaseTrait;

    const KNOWN_SERVICE_NAME = 'Senior Center Fitness Discounts';

    public function testGetAllActivity(): void
    {
        $response = $this->client->request('GET', '/api/user_activities',
            ['headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/UserActivity',
            '@type' => 'hydra:Collection',
            '@id' => '/api/user_activities',
        ]);

        // 2 users (guest1 + user)
        $this->assertCount(2, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(UserActivity::class);
    }

    public function testGetUserActivity(): void
    {
        // Have user archive a service
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);
        $this->client->request('DELETE', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);
        $this->assertResponseStatusCodeSame(204);

        // Get user activity stats
        $this->client->request('GET', '/api/user_activities/user',
            ['headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/UserActivity',
            '@type' => 'UserActivity',
            '@id' => '/api/user_activities/user',
            'username' => 'user',
            'numEdits' => 1,
            'numPublished' => 1,
            'numArchived' => 1,
        ]);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(UserActivity::class);
    }

}
