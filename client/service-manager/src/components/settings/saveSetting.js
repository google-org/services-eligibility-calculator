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

import { ENTRYPOINT } from '../../common/config';
import { fetch } from '../../common/dataAccess';

export default async function saveSetting(name, value) {
  return await fetch(ENTRYPOINT + 'settings/' + name, {
    method: 'PUT',
    body: JSON.stringify({ name: name, value: JSON.stringify(value) || '' })
  })
    .then(response => response.json())
    .catch(async error => {
      console.log('unable to save setting: ' + error);
      console.log('will attempt to create setting');
      return await fetch(ENTRYPOINT + 'settings', {
        method: 'POST',
        body: JSON.stringify({ name: name, value: JSON.stringify(value) })
      })
        .then(response => response.json())
        .catch(error => {
          window.alert(
            'Failed to save setting:\n\t' + name + ': ' + value + '\n\n' + error
          );
          return false;
        });
    });
}
