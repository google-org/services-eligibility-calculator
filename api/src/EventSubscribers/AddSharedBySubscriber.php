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
use App\Entity\ShareBase;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/*
 * Event subscriber that adds the shared by user when a service is shared.
 */
final class AddSharedBySubscriber implements EventSubscriberInterface
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
            KernelEvents::VIEW => ['addSharedBy', EventPriorities::PRE_WRITE],
        ];
    }

    public function addSharedBy(ViewEvent $event)
    {
        $share = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$share instanceof ShareBase ||
            (Request::METHOD_POST !== $method)) {
            // Only handle service shares
            return;
        }

        // Set the created by user before storing.
        $user = $this->tokenStorage->getToken()->getUser();
        $share->sharedByUsername = $user->getUsername();
        if (method_exists($user, 'has') && $user->has("displayName")) {
            $share->sharedByDisplayName = $user->get("displayName");
        } else {
            $share->sharedByDisplayName = $share->sharedByUsername;
        }
    }
}
