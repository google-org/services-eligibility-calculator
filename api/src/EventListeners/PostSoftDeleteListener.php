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
 
use Doctrine\ORM\Events;
use Doctrine\Common\EventSubscriber;
use Doctrine\Common\Persistence\Event\LifecycleEventArgs;
use App\Entity\Service;
use App\Entity\ServiceHistory;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class PostSoftDeleteListener implements EventSubscriber
{

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    public function __construct(TokenStorageInterface $tokenStorage)
    {
        $this->tokenStorage = $tokenStorage;
    }

    public function getSubscribedEvents()
    {
        return array(
            Events::postSoftDelete,
        );
    }

    public function postSoftDelete(LifecycleEventArgs $args)
    {
        $service = $args->getObject();
        $entityManager = $args->getObjectManager();

        if ($service instanceof Service) {
            // Update archived date/time and user before storing.
            $service->archivedDateTime = new \DateTimeImmutable();
            $user = $this->tokenStorage->getToken()->getUser();
            $service->archivedBy = $user->getUsername();
            if (method_exists($user, 'has') && $user->has("displayName")) {
                $service->archivedByDisplayName = $user->get("displayName");
            } else {
                $service->archivedByDisplayName = $service->archivedBy;
            }

            $entityManager->persist($service);
            $entityManager->flush();
        }
    }
}