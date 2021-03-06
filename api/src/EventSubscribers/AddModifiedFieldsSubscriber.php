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


namespace App\EventSubscribers;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Service;
use App\Entity\ServiceDraft;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/*
 * Event subscriber that adds the last modified date/time and user on all
 * Service and ServiceDraft mutations.
 */
final class AddModifiedFieldsSubscriber implements EventSubscriberInterface
{
    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['addModifiedFields', EventPriorities::PRE_WRITE],
        ];
    }

    public function addModifiedFields(ViewEvent $event)
    {
        $service = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ((!$service instanceof Service && !$service instanceof ServiceDraft) ||
            (Request::METHOD_POST !== $method && Request::METHOD_PUT !== $method
                && Request::METHOD_DELETE !== $method)) {
            // Only handle service / draft mutations
            return;
        }

        // Unarchive archived services upon associated draft publication.
        if ($service instanceof Service && Request::METHOD_PUT == $method) {
            // Unarchive service if archived.
            $service->archivedDateTime = null;
            $service->archivedBy = null;
            $service->archivedByDisplayName = null;
        }

        // Update last modified date/time and user before storing.
        $service->lastModifiedDateTime = new \DateTimeImmutable();
        $user = $this->tokenStorage->getToken()->getUser();
        $service->lastModifiedBy = $user->getUsername();
        if (method_exists($user, 'has') && $user->has("displayName")) {
            $service->lastModifiedByDisplayName = $user->get("displayName");
        } else {
            $service->lastModifiedByDisplayName = $service->lastModifiedBy;
        }

        // If a draft, update the # of edits before storing.
        if ($service instanceof ServiceDraft) {
            $service->numEdits++;
        }
    }
}
