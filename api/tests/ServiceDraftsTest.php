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

use App\Entity\Interest;
use App\Entity\Service;
use App\Entity\ServiceDraft;
use App\Entity\User;
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;

class ServiceDraftsTest extends ApiTestCase
{
    // This trait provided by HautelookAliceBundle will take care of refreshing the database content to a known state before each test
    use RefreshDatabaseTrait;

    const KNOWN_SERVICE_NAME_1 = 'Senior Center Fitness Discounts';
    const KNOWN_SERVICE_NAME_2 = 'Food Tax Rebate Program';
    const KNOWN_DRAFT_NAME = 'Food Tax Rebate Program';

    public function testGetCollectionAdminUser(): void
    {
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = $this->client->request('GET', '/api/service_drafts', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceDraft',
            '@id' => '/api/service_drafts',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 3,
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(3, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(ServiceDraft::class);
    }

    public function testGetCollection(): void
    {
        // The client implements Symfony HttpClient's `HttpClientInterface`, and the response `ResponseInterface`
        $response = $this->client->request('GET', '/api/service_drafts', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        // Asserts that the returned content type is JSON-LD (the default)
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Asserts that the returned JSON is a superset of this one
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceDraft',
            '@id' => '/api/service_drafts',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 2,
        ]);

        // Because test fixtures are automatically loaded between each test, you can assert on them
        $this->assertCount(2, $response->toArray()['hydra:member']);

        // Asserts that the returned JSON is validated by the JSON Schema generated for this resource by API Platform
        // This generated JSON Schema is also used in the OpenAPI spec!
        $this->assertMatchesResourceCollectionJsonSchema(ServiceDraft::class);
    }

    public function testShareDraft(): void
    {
        $response = $this->client->request('GET', '/api/service_drafts', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);

        $adminDrafts = $response->toArray()['hydra:member'];

        $this->assertResponseIsSuccessful();
        $this->assertCount(3, $adminDrafts);

        // Verify that the last draft was not created by, nor shared with 'user'
        $this->assertArraySubset(
            ['createdBy' => 'guest1',
                'shares' => [],
            ], $adminDrafts[2]);

        // Share the last draft with 'user'
        $response = $this->client->request('POST', '/api/service_draft_shares', [
            'json' => [
                'draftService' => $adminDrafts[2]['@id'],
                'sharedWithUsername' => 'user',
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Now retrieve all the drafts for 'user'.
        $response = $this->client->request('GET', '/api/service_drafts', [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceDraft',
            '@id' => '/api/service_drafts',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 3, // With newly shared service, now there are 3.
        ]);
        $userDrafts = $response->toArray()['hydra:member'];
        $this->assertCount(3, $userDrafts);

        // Verify that the newly shared draft is now there.
        $this->assertArraySubset(
            ['createdBy' => 'guest1',
                'shares' => [[
                    'sharedByUsername' => 'admin',
                    'sharedByDisplayName' => 'admin',
                    'sharedWithUsername' => 'user',
                ]],
            ], $userDrafts[2]);
    }

    public function testCreateDraft(): void
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'user']);
        $numEdits = $user->numEdits;

        $newServiceName = 'A wonderful service available to all.';
        $newServiceUrl = 'http://myservice.com';
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME_1]);
        $interestIri = static::findIriBy(Interest::class, ['name' => 'Housing']);
        $response = $this->client->request('POST', '/api/service_drafts', [
            'json' => [
                'name' => $newServiceName,
                'applicationOnline' => $newServiceUrl,
                'interests' => [$interestIri],
                'service' => $serviceIri,
            ],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/ServiceDraft',
            '@type' => 'ServiceDraft',
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
            'numEdits' => 1,
        ]);

        $this->assertArraySubset(
            ['@id' => $serviceIri], $response->toArray()['service']);

        // Ensure the id is a valid uuid.
        $this->assertRegExp('~^/api/service_drafts/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$~', $response->toArray()['@id']);
        $this->assertMatchesResourceItemJsonSchema(ServiceDraft::class);

        /** @var User */
        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'user']);
        $this->assertArraySubset([
            'username' => 'user',
            'numEdits' => $numEdits + 1,
        ], get_object_vars($user));
    }

    public function testUpdateDraft(): void
    {
        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'user']);
        $numEdits = $user->numEdits;

        $iri = static::findIriBy(ServiceDraft::class, ['name' => static::KNOWN_DRAFT_NAME]);

        $updatedDescription = 'A newly updated description for testing.';
        $this->client->request('PUT', $iri, [
            'json' => ['description' => $updatedDescription],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => static::KNOWN_DRAFT_NAME,
            'description' => $updatedDescription,
            'lastModifiedBy' => 'user',
            'lastModifiedAgo' => '1 second ago',
            'numEdits' => 2,
        ]);

        /** @var User */
        $user = $this->em->getRepository(User::class)->findOneBy(['username' => 'user']);
        $this->assertArraySubset([
            'username' => 'user',
            'numEdits' => $numEdits + 1,
        ], get_object_vars($user));
    }

    public function testCreateDraft_CollisionWithExistingDraft(): void
    {
        $newServiceName = 'A wonderful service available to all.';
        $newServiceUrl = 'http://myservice.com';
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME_2]);
        $interestIri = static::findIriBy(Interest::class, ['name' => 'Housing']);
        $response = $this->client->request('POST', '/api/service_drafts', [
            'json' => [
                'name' => $newServiceName,
                'applicationOnline' => $newServiceUrl,
                'interests' => [$interestIri],
                'service' => $serviceIri,
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
            'hydra:description' => "service: This value is already used.",
        ]);
    }

    public function testDraftPropertyInService(): void
    {
        $serviceIri = static::findIriBy(Service::class, ['name' => static::KNOWN_SERVICE_NAME_2]);
        $draftIri = static::findIriBy(ServiceDraft::class, ['name' => static::KNOWN_SERVICE_NAME_2]);
        $response = $this->client->request('GET', $serviceIri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/api/contexts/Service',
            '@type' => 'Service',
            'name' => static::KNOWN_SERVICE_NAME_2,
        ]);

        $draft = $response->toArray()['draft'];

        // Verify that the newly shared draft is now there.
        $this->assertArraySubset([
            '@id' => $draftIri,
            '@type' => 'ServiceDraft',
        ], $draft);
    }

    public function testCreateInvalidServiceDraft_missingRequiredFields(): void
    {
        $this->client->request('POST', '/api/service_drafts', [
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

}
