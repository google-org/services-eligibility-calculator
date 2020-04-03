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

declare (strict_types = 1);

namespace App\Security;

use LdapTools\Bundle\LdapToolsBundle\Security\LdapGuardAuthenticator;
use Symfony\Component\HttpFoundation\Request;

class JsonLdapGuardAuthenticator extends LdapGuardAuthenticator
{
    /**
     * @var array
     */
    private $requestContent;

    /**
     * @param Request $request
     *
     * @return array|null|false
     */
    private function getContent(Request $request)
    {
        if ($this->requestContent === null) {
            $this->requestContent = json_decode($request->getContent(), true);
        }
        return $this->requestContent;
    }

    /**
     * {@inheritdoc}
     */
    public function supports(Request $request): bool
    {
        $content = $this->getContent($request);
        return $content !== null && $content !== false;
    }

    /**
     * @param Request $request
     * @return null|string
     */
    protected function getRequestDomain(Request $request): ?string
    {
        return null;
    }

    /**
     * @param string $param
     * @param Request $request
     * @return string|null
     */
    protected function getRequestParameter($param, Request $request): ?string
    {
        $content = $this->getContent($request);
        if (isset($content[$param])) {
            return $content[$param];
        }
        return null;
    }
}
