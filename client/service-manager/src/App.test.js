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

import { axe, toHaveNoViolations } from 'jest-axe';
import {
  mockArchivedServicesJson,
  mockServicesJson,
  mockSettingsJson
} from './../../testing/mockData';

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

expect.extend(toHaveNoViolations);

it('renders without crashing and no violations', async () => {
  const div = document.createElement('div');

  fetch.resetMocks();
  fetch.doMockOnceIf(
    url => url.includes('/api/settings?pagination=false'),
    mockSettingsJson
  );
  fetch.doMockOnceIf(
    url =>
      url.includes(
        '/api/services?pagination=false&exists[archivedDateTime]=false'
      ),
    mockServicesJson
  );
  fetch.doMockOnceIf(
    url =>
      url.includes(
        '/api/services?pagination=false&exists[archivedDateTime]=true'
      ),
    mockArchivedServicesJson
  );

  await act(async () => {
    ReactDOM.render(<App testMode={true} />, div);
  });

  expect(await axe(div)).toHaveNoViolations();
});
