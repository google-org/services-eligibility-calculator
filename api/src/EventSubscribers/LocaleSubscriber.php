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

use Gedmo\Translatable\TranslatableListener;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class LocaleSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;
    private $translatableListener;

    public function __construct(TranslatableListener $translatableListener, string $defaultLocale = 'en')
    {
        $this->translatableListener = $translatableListener;
        $this->defaultLocale = $defaultLocale;
    }

    public function onKernelRequest(GetResponseEvent $event)
    {
        $request = $event->getRequest();

        if ($locale = $request->query->get('locale')) {
            // If locale explicitly set in parameters, use that locale
            $request->setLocale($locale);
        } else if (Request::METHOD_GET === $request->getMethod()) {
            // For read, see if the locale has been set as an accept-language routing parameter
            if ($localeHeader = $request->headers->get('accept-language')) {
                $locale = \Locale::GetPrimaryLanguage($localeHeader);
                $request->setLocale($locale);
            } else {
                // If no explicit locale has been set on this read request, use one from the session, or default
                $request->setLocale($request->getSession()->get('_locale', $this->defaultLocale));
            }
        } else {
            $request->setLocale($this->defaultLocale);
        }

        if ($request->query->get('noTranslationFallback')) {
            $this->translatableListener->setTranslationFallback(false);
        } else {
            $this->translatableListener->setTranslationFallback(true);
        }

        $request->getSession()->set('_locale', $request->getLocale());
        $this->translatableListener->setTranslatableLocale($request->getLocale());
    }

    public static function getSubscribedEvents()
    {
        return array(
            // Priority must be between 17 and 127 (between the LocaleListener & ReadListener)
            // Run bin/console debug:event kernel.request for a list of listeners and priorities
            KernelEvents::REQUEST => array(array('onKernelRequest', 17)),
        );
    }
}
