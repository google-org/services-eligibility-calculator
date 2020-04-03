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

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

final class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     *
     * @return void
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $data = $event->getData();

        if (method_exists($user, 'get')) {
            if ($user->get('displayName')) {
                $data['displayName'] = $user->get('displayName');
            }

            if ($user->get('mail')) {
                $data['mail'] = $user->get('mail');
            }

            if ($user->get('thumbnailPhoto')) {
                $data['thumbnailPhoto'] = $user->get('thumbnailPhoto');
            }
        }

        $event->setData($data);
    }
}
