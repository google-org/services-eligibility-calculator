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

import { ENTRYPOINT } from './config/entrypoint';
import get from 'lodash/get';
import { getEncodedJwtToken } from './auth';
import has from 'lodash/has';
import mapValues from 'lodash/mapValues';

const MIME_TYPE = 'application/ld+json';

export function fetch(url, options = {}) {
  if ('undefined' === typeof options.headers) options.headers = new Headers();
  if (null === options.headers.get('Accept'))
    options.headers.set('Accept', MIME_TYPE);

  if (
    'undefined' !== options.body &&
    !('undefined' !== typeof FormData && options.body instanceof FormData) &&
    null === options.headers.get('Content-Type')
  ) {
    options.headers.set('Content-Type', MIME_TYPE);
  }

  var jwtToken = getEncodedJwtToken();
  if (jwtToken) {
    options.headers.set('Authorization', 'Bearer ' + jwtToken);
  }

  var fullUrl = new URL(url, ENTRYPOINT);
  return global.fetch(fullUrl.href, options).then(response => {
    if (response.ok) return response;

    if (response.status === 401) {
      throw new Error(response.statusText || 'Authorization Error.');
    }

    return response.json().then(
      json => {
        const error =
          json['hydra:description'] ||
          json['hydra:title'] ||
          'An error occurred.';
        if (!json.violations) throw Error(error);

        let errors = { _error: error };
        json.violations.forEach(violation =>
          errors[violation.propertyPath]
            ? (errors[violation.propertyPath] +=
                '\n' + errors[violation.propertyPath])
            : (errors[violation.propertyPath] = violation.message)
        );

        throw new Error(errors);
      },
      () => {
        throw new Error(response.statusText || 'An error occurred.');
      }
    );
  });
}

export function mercureSubscribe(url, topics) {
  topics.forEach(topic =>
    url.searchParams.append('topic', new URL(topic, ENTRYPOINT))
  );

  return new EventSource(url.toString());
}

export function normalize(data) {
  if (has(data, 'hydra:member')) {
    // Normalize items in collections
    data['hydra:member'] = data['hydra:member'].map(item => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, value =>
    Array.isArray(value)
      ? value.map(v => get(v, '@id', v))
      : get(value, '@id', value)
  );
}

export function extractHubURL(response) {
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
}
