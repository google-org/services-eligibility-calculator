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
use App\Tests\ApiTestCase;
use Hautelook\AliceBundle\PhpUnit\ReloadDatabaseTrait;

class TranslationsTest extends ApiTestCase
{
    // Reloads database between each test. Refresh does not work as it does not persist data within a test.
    use ReloadDatabaseTrait;

    const SERVICE_NAME_ENGLISH = 'Senior Center Fitness Discounts';
    const SERVICE_NAME_ENGLISH_UPDATE = 'Senior Center Fitness Discounts Update';
    const SERVICE_NAME_SPANISH = 'Descuentos para gimnasios en centros de ancianos';
    const DRAFT_NAME_ENGLISH = 'Food Tax Rebate Program';
    const DRAFT_NAME_SPANISH = 'Programa de reembolso de impuestos alimentarios';

    public function testTranslation(): void
    {
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::SERVICE_NAME_ENGLISH));

        $service->name = self::SERVICE_NAME_SPANISH;
        $service->locale = 'es';
        $this->em->persist($service);
        $this->em->flush();

        $repository = $this->em->getRepository('Gedmo\Translatable\Entity\Translation');
        $translations = $repository->findTranslations($service);
        $this->assertCount(1, $translations);
        $this->assertEquals(self::SERVICE_NAME_SPANISH, $translations['es']['name']);

        // Can still look up the original service by it's English name
        $storedService = $this->em->getRepository(service::class)
            ->findOneBy(array('name' => self::SERVICE_NAME_ENGLISH));

        // But the name is in Spanish in this session
        $this->assertEquals(self::SERVICE_NAME_SPANISH, $storedService->name);

        // Defaults to English if no translation
        $storedService->locale = 'de';
        $this->em->refresh($storedService);
        $this->assertEquals(self::SERVICE_NAME_ENGLISH, $storedService->name);
    }

    public function testTranslateServiceApi(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::SERVICE_NAME_ENGLISH]);
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::SERVICE_NAME_ENGLISH));
        $englishDescription = $service->description;

        // Call GET on the service to set up the TranslatableListener with default English values
        // (otherwise these will not be skipped in the PUT and will be stored as Spanish values)
        $this->client->request('GET', $iri . '?locale=es');
        $this->assertResponseIsSuccessful();

        // Update the service with the Spanish translation
        $this->client->request('PUT', $iri . '?locale=es', [
            'json' => ['name' => static::SERVICE_NAME_SPANISH],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->userToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Get Spanish version through header
        $response = $this->client->request('GET', $iri, [
            'headers' => ['accept-language' => 'es'],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::SERVICE_NAME_SPANISH,
            'description' => $englishDescription, // Defaults to English since not translated
        ]);

        // Get Spanish version through query parameter
        $response = $this->client->request('GET', $iri . '?locale=es', [
            'headers' => ['accept-language' => 'en'], // Should be overriden by query param
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::SERVICE_NAME_SPANISH,
            'description' => $englishDescription, // Defaults to English since not translated
        ]);

        // Get English version by default
        $response = $this->client->request('GET', $iri);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::SERVICE_NAME_ENGLISH,
            'description' => $englishDescription,
        ]);

        // Get Spanish version without translation fallback to English
        $response = $this->client->request('GET', $iri . '?locale=es&noTranslationFallback=true', [
            'headers' => ['accept-language' => 'en'], // Should be overriden by query param
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::SERVICE_NAME_SPANISH,
            'description' => '', // No translation & fallback disabled
        ]);
    }

    public function testRemoveTranslation(): void
    {
        $iri = static::findIriBy(Service::class, ['name' => static::SERVICE_NAME_ENGLISH]);
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::SERVICE_NAME_ENGLISH));
        $englishDescription = $service->description;
        $spanishDescription = 'Descripción en español';

        // Call GET on the service to set up the TranslatableListener
        $this->client->request('GET', $iri . '?locale=es');
        $this->assertResponseIsSuccessful();

        // Update the service with the Spanish translation
        $this->client->request('PUT', $iri . '?locale=es', [
            'json' => ['description' => $spanishDescription],
            'headers' => ['Authorization' => 'Bearer ' . $this->userToken],
        ]);
        $this->assertResponseIsSuccessful();

        // Check updated
        $response = $this->client->request('GET', $iri . '?locale=es');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['description' => $spanishDescription]);

        // Update the service, clearing the Spanish translation
        $this->client->request('PUT', $iri . '?locale=es', [
            'json' => ['description' => null],
            'headers' => ['Authorization' => 'Bearer ' . $this->userToken],
        ]);
        $this->assertResponseIsSuccessful();

        // Check defaulting back to English
        $response = $this->client->request('GET', $iri . '?locale=es');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['description' => $englishDescription]);
    }

    public function testPublishDraftTranslations(): void
    {
        $newDescription = "My new description";

        $iri = static::findIriBy(ServiceDraft::class, ['name' => static::DRAFT_NAME_ENGLISH]);
        $draft = $this->em->getRepository(ServiceDraft::class)->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));

        // Call GET on the draft to set up the TranslatableListener
        $this->client->request('GET', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Update draft description
        $draft->description = $newDescription;
        $this->em->persist($draft);
        $this->em->flush();

        // Save a Spanish translation of the draft
        $draft->name = self::DRAFT_NAME_SPANISH;
        $draft->locale = 'es';
        $this->em->persist($draft);
        $this->em->flush();

        // Publish the draft (in all languages)
        $this->client->request('PUT', $iri . '/publish', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::DRAFT_NAME_ENGLISH,
            'description' => $newDescription,
        ]);

        // Look up the published service
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));

        // Check English description copied from draft
        $service->locale = 'en';
        $this->em->refresh($service);
        $this->assertEquals(self::DRAFT_NAME_ENGLISH, $service->name);
        $this->assertEquals($newDescription, $service->description);

        // Check Spanish version published
        $service->locale = 'es';
        $this->em->refresh($service);
        $this->assertEquals(self::DRAFT_NAME_SPANISH, $service->name);
        $this->assertEquals($newDescription, $service->description);
    }

    // Tests that locale in query parameter or header is ignored when publishing
    public function testPublishDraftTranslationsWithLocale(): void
    {
        $iri = static::findIriBy(ServiceDraft::class, ['name' => static::DRAFT_NAME_ENGLISH]);
        $draft = $this->em->getRepository(ServiceDraft::class)->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));

        // Call GET on the draft to set up the TranslatableListener
        $this->client->request('GET', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Save a Spanish translation of the draft
        $draft->name = self::DRAFT_NAME_SPANISH;
        $draft->locale = 'es';
        $this->em->persist($draft);
        $this->em->flush();

        // Publish the draft (in all languages), & ensure query parameter locale is ignored
        $this->client->request('PUT', $iri . '/publish?locale=es', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
                'headers' => ['accept-language' => 'es'],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::DRAFT_NAME_ENGLISH,
        ]);

        // Look up the published service in English & check Spanish version published
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));
        $service->locale = 'es';
        $this->em->refresh($service);
        $this->assertEquals(self::DRAFT_NAME_SPANISH, $service->name);

        // Publish the draft (in all languages), & ensure accept-language header ignored
        $this->client->request('PUT', $iri . '/publish?locale=es', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@type' => 'Service',
            'name' => static::DRAFT_NAME_ENGLISH,
        ]);

        // Look up the published service in English & check Spanish version published
        $service = $this->em->getRepository(Service::class)
            ->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));
        $service->locale = 'es';
        $this->em->refresh($service);
        $this->assertEquals(self::DRAFT_NAME_SPANISH, $service->name);
    }

    public function testRemovePublishedTranslation(): void
    {
        $iri = static::findIriBy(ServiceDraft::class, ['name' => static::DRAFT_NAME_ENGLISH]);
        $draft = $this->em->getRepository(ServiceDraft::class)->findOneBy(array('name' => self::DRAFT_NAME_ENGLISH));
        $englishDescription = $draft->description;
        $spanishDescription = 'Descripción en español';

        // Call GET on the draft to set up the TranslatableListener
        $this->client->request('GET', $iri, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Save a Spanish translation of the draft
        $this->client->request('PUT', $iri . '?locale=es', [
            'json' => ['description' => $spanishDescription],
            'headers' => ['Authorization' => 'Bearer ' . $this->adminToken],
        ]);
        $this->assertResponseIsSuccessful();

        // Publish the draft
        $this->client->request('PUT', $iri . '/publish', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Check Spanish description set in published service
        $publishedIri = static::findIriBy(Service::class, ['name' => static::DRAFT_NAME_ENGLISH]);
        $response = $this->client->request('GET', $publishedIri . '?locale=es');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['description' => $spanishDescription]);

        // Remove Spanish translation of the draft
        $this->client->request('PUT', $iri . '?locale=es', [
            'json' => ['description' => null],
            'headers' => ['Authorization' => 'Bearer ' . $this->adminToken],
        ]);
        $this->assertResponseIsSuccessful();

        // Publish the draft
        $this->client->request('PUT', $iri . '/publish', [
            'json' => [],
            'headers' => [
                'Authorization' => 'Bearer ' . $this->adminToken,
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Check defaulting back to English
        $response = $this->client->request('GET', $publishedIri . '?locale=es');
        $this->assertResponseIsSuccessful();
        $this->assertJsonContains(['description' => $englishDescription]);
    }

}
