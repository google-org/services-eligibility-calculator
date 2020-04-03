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


namespace App\EventListeners;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class LoginEventListener
{
    /**
     * @var EntityManagerInterface
     */
    protected $em;

    /**
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @param InteractiveLoginEvent $event
     */
    public function onLoginSuccess(InteractiveLoginEvent $event)
    {
        if ($event->getRequest()->getRequestUri() != '/api/login') {
            // Only record login success events when accessing the login url.
            return;
        }

        $loginUser = $event->getAuthenticationToken()->getUser();

        /** @var User $user */
        $user = $this->em->getRepository(User::class)->findOneBy(['username' => $loginUser->getUsername()]);

        if (!$user) {
            $user = new User();
            $user->username = $loginUser->getUsername();
            $user->logins = 0;
        }

        $user->logins++;
        if (method_exists($loginUser, 'has') && $loginUser->has("displayName")) {
            $user->displayName = $loginUser->get('displayName');
        } else {
            $user->displayName = $user->username;
        }
        $user->lastLogin = new \DateTime();

        $this->em->persist($user);
        $this->em->flush();
    }
}
