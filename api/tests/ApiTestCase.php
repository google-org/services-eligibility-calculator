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

use ApiPlatform\Core\Bridge\Symfony\Bundle\Test\ApiTestCase as SymfonyApiTestCase;

abstract class ApiTestCase extends SymfonyApiTestCase
{
   
    protected $client;
    protected $userToken;
    protected $adminToken;

    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $em;

    /**
     * Create a JWT token for a logged in user in the given role.
     *
     * @param string $username the username of the user
     * @param string $role role of the user ('ROLE_ADMIN', 'ROLE_USER')
     * @return type user JWT token
     */
    protected function createJwtToken($username, $role)
    {
        $data = array('username' => $username, 'roles' => [$role]);

        return $this->client->getContainer()
            ->get('lexik_jwt_authentication.encoder')
            ->encode($data);
    }

    protected function setUp(): void
    {
        $this->client = static::createClient();
        $this->em = $this->client->getContainer()->get('doctrine')->getManager();
        $this->userToken = $this->createJwtToken('user', 'ROLE_USER');
        $this->adminToken = $this->createJwtToken('admin', 'ROLE_ADMIN');
    }
}
