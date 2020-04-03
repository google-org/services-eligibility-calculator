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

use App\Entity\Setting;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class SettingsTest extends ApiTestCase
{
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    public function testGetAllSettings(): void
    {
        $this->client->request('GET', '/api/settings');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Setting',
            '@type' => 'hydra:Collection',
            '@id' => '/api/settings',
            'hydra:totalItems' => 3,
        ]);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        $this->assertMatchesResourceCollectionJsonSchema(Setting::class);
    }

    public function testUpdateSetting(): void
    {
        $this->client->request('PUT', '/api/settings/ami', [
            'json' => ['name' => 'ami', 'value' => '[0,1,2,3,0,1,2,3]'],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@type' => 'Setting',
            '@id' => '/api/settings/ami',
            'name' => 'ami',
            'value' => '[0,1,2,3,0,1,2,3]',
        ]);
    }

}
