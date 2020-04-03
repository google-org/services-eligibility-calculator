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

import { fetch } from './common/dataAccess';

export default { fetchServices, fetchSettings, fetchInterests };

export function fetchServices(locale) {
  return fetch(
    `services?pagination=false&exists[archivedDateTime]=false&locale=${locale}`
  ).then(response =>
    response.json().then(data => data && data['hydra:member'])
  );
}

export function fetchInterests(locale) {
  return fetch(`interests?pagination=false&locale=${locale}`).then(response =>
    response.json().then(data => data && data['hydra:member'])
  );
}

export function fetchSettings() {
  return fetch('settings?pagination=false').then(response =>
    response.json().then(data => {
      let rawSettings = data && data['hydra:member'];
      return rawSettings.reduce((result, item) => {
        try {
          result[item.name] = JSON.parse(item.value);
        } catch (e) {
          result[item.name] = item.value;
        }
        return result;
      }, {});
    })
  );
}
