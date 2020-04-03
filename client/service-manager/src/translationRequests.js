/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cleanValues, {
  filterForTranslatableValues,
  getTranslatedEligibilityProfiles
} from './components/service/ServiceCleaner';
import { defaultLocale, locales } from './Locales';

import { fetch } from './common/dataAccess';

export const updateRequest = (locale, uri, values) =>
  fetch(uri + '?locale=' + locale, {
    method: 'PUT',
    body: JSON.stringify(values)
  }).then(response => response.json());

/**
 * Gets an array of promises to update a service in the non-default locales.
 */
export function getTranslationUpdateRequests(uri, values) {
  const updateRequests = [];
  const defaultLocaleProfiles = values[defaultLocale].eligibilityProfiles;
  locales.forEach(loc => {
    const locale = loc.locale;
    if (locale !== defaultLocale) {
      const localeValues = values[locale];
      let cleaned = cleanValues(localeValues);
      cleaned = filterForTranslatableValues(cleaned);
      cleaned.eligibilityProfiles = getTranslatedEligibilityProfiles(
        defaultLocaleProfiles,
        cleaned.eligibilityProfiles
      );
      updateRequests.push(updateRequest(locale, uri, cleaned));
    }
  });
  return updateRequests;
}

const getRequest = (locale, uri, disableTranslationFallback = false) =>
  fetch(
    `${uri}?locale=${locale}${
      disableTranslationFallback ? '&noTranslationFallback=true' : ''
    }`
  ).then(response => response.json());

export function getTranslationGetRequests(
  uri,
  disableTranslationFallback = false
) {
  const getRequests = [];
  locales.forEach(loc => {
    const locale = loc.locale;
    getRequests.push(getRequest(locale, uri, disableTranslationFallback));
  });
  return getRequests;
}
