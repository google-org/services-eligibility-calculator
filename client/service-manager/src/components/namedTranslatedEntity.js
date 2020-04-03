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

import { defaultLocale, localeLanguage, locales } from '../Locales';

import React from 'react';
import { fetch } from '../common/dataAccess';
import { updateRequest } from '../translationRequests';

export const createNamedEntity = (uri, values, onComplete) => {
  // Post the entity in the default locale
  fetch(uri + '?locale=' + defaultLocale, {
    method: 'POST',
    body: JSON.stringify({
      ...values,
      name: values['name-' + defaultLocale]
    })
  })
    .then(response => response.json())
    .then(json => {
      // Update the entity in the other locale(s).
      const updateRequests = [];
      locales.forEach(l => {
        const locale = l.locale;
        if (locale !== defaultLocale) {
          const localeEntity = {
            ...values,
            '@id': json['@id'],
            name: values['name-' + locale]
          };
          updateRequests.push(updateRequest(locale, json['@id'], localeEntity));
        }
      });
      Promise.all(updateRequests)
        .then(onComplete)
        .catch(error => {
          window.alert('Failed to create:\n\t' + values.name + '\n\n' + error);
          onComplete();
        });
    });
};

export const updateNamedEntity = (uri, values, onComplete) => {
  const updateRequests = [];
  locales.forEach(l => {
    const locale = l.locale;
    const localeEntity = { ...values, name: values['name-' + locale] };
    updateRequests.push(updateRequest(locale, uri, localeEntity));
  });
  Promise.all(updateRequests)
    .then(onComplete)
    .catch(error => {
      window.alert('Failed to update:\n\t' + values.name + '\n\n' + error);
      onComplete();
    });
};

export const nonDefaultLocales = (id, entities) => {
  let retVal = {};
  for (let [locale, localeEntities] of Object.entries(entities)) {
    if (locale !== defaultLocale) {
      retVal[locale] = localeEntities.find(entity => entity['@id'] === id);
    }
  }
  return retVal;
};

export const renderNonDefaultLocales = (field, translations) => {
  let values = [];
  Object.entries(translations).map(([locale, translation]) => {
    if (locale !== defaultLocale) {
      values.push(
        <i key={locale}>
          {localeLanguage(locale)}: {translation[field]}
        </i>
      );
    }
    return values;
  });
  return <>({values})</>;
};
