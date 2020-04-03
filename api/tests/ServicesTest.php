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

use App\Entity\Department;
use App\Entity\Interest;
use App\Entity\Service;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class ServicesTest extends ApiTestCase
{
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    const KNOWN_SERVICE_NAME = 'Senior Center Fitness Discounts';

    public function testGetCollection(): void
    {
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = $this->client->request('GET', '/api/services?exists[archivedDateTime]=false');

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            '@id' => '/api/services',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 19,
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(19, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Service::class);
    }

    public function testGetArchivedCollection(): void
    {
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = $this->client->request('GET', '/api/services?exists[archivedDateTime]=true');

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            '@id' => '/api/services',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 1,
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(1, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Service::class);
    }

    public function testGetService(): void
    {
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);
        $departmentIri = static::findIriBy(Department::class, ['name' => 'Housing and Human Services']);

        $response = $this->client->request('GET', $serviceIri);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            '@type' => 'Service',
            'name' => static::KNOWN_SERVICE_NAME,
            'department' => [
                '@id' => $departmentIri,
                '@type' => 'Department',
                'name' => 'Housing and Human Services',
            ],
        ]);

        // Ensure the id is a valid uuid.
        $this->assertRegExp('~^/api/services/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Service::class);
    }

    public function testGetServiceByName(): void
    {
        $departmentIri = static::findIriBy(Department::class, ['name' => 'Housing and Human Services']);

        $response = $this->client->request('GET', '/api/services?name=' . static::KNOWN_SERVICE_NAME);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertCount(1, $response->toArray()['hydra:member']);
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            'hydra:member' => [(
                [
                    '@type' => 'Service',
                    'name' => static::KNOWN_SERVICE_NAME,
                    'department' => [
                        '@id' => $departmentIri,
                        '@type' => 'Department',
                        'name' => 'Housing and Human Services',
                    ],
                ]
            )],
        ]);

        $this->assertMatchesResourceItemJsonSchema(Service::class);
    }

    public function testCreateService(): void
    {
        $newServiceName = 'A wonderful service available to all.';
        $newServiceUrl = 'http://myservice.com';
        $interestIri = static::findIriBy(Interest::class, ['name' => 'Housing']);
        $response = $this->client->request('POST', '/api/services', [
            'json' => [
                'name' => $newServiceName,
                'applicationOnline' => $newServiceUrl,
                'interests' => [$interestIri],
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            '@type' => 'Service',
            'name' => $newServiceName,
            'applicationOnline' => $newServiceUrl,
            'interests' => [[
                '@id' => $interestIri,
                '@type' => 'Interest',
                'name' => 'Housing',
                'materialIcon' => 'home',
            ]],
            'lastModifiedBy' => 'user',
            'lastModifiedAgo' => '1 second ago',
        ]);
        // Ensure the id is a valid uuid.
        $this->assertRegExp('~^/api/services/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Service::class);
    }

    public function testCreateInvalidService_missingRequiredFields(): void
    {
        $this->client->request('POST', '/api/services', [
            'json' => [
                'name' => '',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(400);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => "name: This value should not be blank.",
        ]);
    }

    public function testCreateInvalidService_nonExistentDepartment(): void
    {
        $this->client->request('POST', '/api/services', [
            'json' => [
                'name' => 'Name',
                'description' => 'Description',
                // A random uuid (i.e. not one of the ones in the fixture).
                'department' => '/api/departments/e4636cf1-ea7f-4ec8-94ee-7d2c64395f4c',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(400);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'Item not found for "/api/departments/e4636cf1-ea7f-4ec8-94ee-7d2c64395f4c".',
        ]);
    }

    public function testUpdateService(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);

        $updatedDescription = 'The updated first service.';
        $this->client->request('PUT', $iri, [
            'json' => ['description' => $updatedDescription],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => static::KNOWN_SERVICE_NAME,
            'description' => $updatedDescription,
            'lastModifiedBy' => 'user',
            'lastModifiedAgo' => '1 second ago',
        ]);
    }

    public function testArchiveService(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);

        $this->client->request('DELETE', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME, 'archivedDateTime' => null]));
        $this->assertNotNull(static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME, 'archivedBy' => 'user']));
    }

    public function testUnarchiveService(): void
    {
        $iri = static::findIriBy(Service::class, ['archivedBy' => 'doejane']);

        $updatedDescription = 'The unarchived service.';
        $this->client->request('PUT', $iri, [
            'json' => ['description' => $updatedDescription],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'description' => $updatedDescription,
            'lastModifiedAgo' => '1 second ago',
            'archivedDateTime' => null,
            'archivedBy' => null,
            'archivedByDisplayName' => null,
        ]);
    }

    public function testDeleteService_noLoggedInUser(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);

        $this->client->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetService_noLoggedInUser(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);

        // Get with authentication
        $response = $this->client->request('GET', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertTrue(property_exists(json_decode($response->getContent()), 'lastModifiedBy'));

        // Get without authentication
        $response = $this->client->request('GET', $iri);
        $this->assertResponseIsSuccessful();
        // Ensure scrub sensitive metadata
        $this->assertFalse(property_exists(json_decode($response->getContent()), 'lastModifiedBy'));
    }

    public function testTranslateService(): void
    {
        $serviceNameSpanish = 'Descuentos para gimnasios en centros de ancianos';
        $iri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME]);

        $this->client->request('PUT', $iri, [
            'json' => ['name' => $serviceNameSpanish],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
                'accept-language' => 'es',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => $serviceNameSpanish,
        ]);
    }
}
