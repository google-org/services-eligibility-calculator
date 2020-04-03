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
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class DepartmentsTest extends ApiTestCase
{ 
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    const KNOWN_DEPARTMENT_NAME = 'Other';
    const TOTAL_NUM_DEPARTMENTS = 21;

    public function testGetDepartments(): void
    {
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = static::createClient()->request('GET', '/api/departments');

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/Department',
            '@id' => '/api/departments',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => static::TOTAL_NUM_DEPARTMENTS,
        ]);

        // Asserts response contains correct number of items
        $this->assertCount(static::TOTAL_NUM_DEPARTMENTS, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(Department::class);
    }

    public function testGetDepartment(): void
    {
        $client = static::createClient();
        $iri = static::findIriBy(Department::class, ['name' => static::KNOWN_DEPARTMENT_NAME]);
        $response = static::createClient()->request('GET', $iri);
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Department',
            '@type' => 'Department',
            'name' => static::KNOWN_DEPARTMENT_NAME,
        ]);
        // Ensure the id is a valid uuid.
        $this->assertRegExp('~^/api/departments/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Department::class);
    }

    public function testCreateDepartment(): void
    {
        $newDepartmentName = 'New Department';
        $response = static::createClient()->request('POST', '/api/departments', [
            'json' => [
                'name' => $newDepartmentName,
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Department',
            '@type' => 'Department',
            'name' => $newDepartmentName,
        ]);
        // Ensure the id is a valid uuid.
        $this->assertRegExp('~^/api/departments/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(Department::class);
    }

    public function testCreateInvalidDepartment(): void
    {
        static::createClient()->request('POST', '/api/departments', [
            'json' => [
                'name' => '',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(400);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    public function testUpdateDepartment(): void
    {
        $client = static::createClient();
        $iri = static::findIriBy(Department::class, ['name' => static::KNOWN_DEPARTMENT_NAME]);

        $updatedName = 'Something else';
        $client->request('PUT', $iri, [
            'json' => [
                'name' => $updatedName,
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => $updatedName,
        ]);
    }

    public function testUpdateInvalidDepartment(): void
    {
        $client = static::createClient();
        $iri = static::findIriBy(Department::class, ['name' => static::KNOWN_DEPARTMENT_NAME]);

        $updatedName = '';
        $client->request('PUT', $iri, [
            'json' => [
                'name' => $updatedName,
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(400);
    }

    public function testDeleteDepartment(): void
    {
        $client = static::createClient();
        $iri = static::findIriBy(Department::class, ['name' => static::KNOWN_DEPARTMENT_NAME]);

        $client->request('DELETE', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(static::findIriBy(Department::class, ['name' => static::KNOWN_DEPARTMENT_NAME]));
    }
}
