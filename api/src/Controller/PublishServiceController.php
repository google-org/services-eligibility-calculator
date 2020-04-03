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


namespace App\Controller;

use App\Entity\ServiceDraft;
use App\Handler\PublishServiceHandler;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;

class PublishServiceController extends AbstractController
{
    private $publishHandler;

    public function __construct(PublishServiceHandler $publishHandler, SerializerInterface $serializer)
    {
        $this->publishHandler = $publishHandler;
        $this->serializer = $serializer;
    }

    /**
     * Publishes all translations of the draft.
     * Returns the default-language version of the published service.
     */
    public function __invoke(ServiceDraft $data): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $service = $this->publishHandler->handle($data, $entityManager);

        $response = new Response();
        $response->setStatusCode(Response::HTTP_OK);
        $response->setContent($this->serializer->serialize($service, 'jsonld'));
        return $response;
    }
}
