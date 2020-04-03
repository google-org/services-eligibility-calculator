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

import './i18n';

import jestFetchMock from 'jest-fetch-mock';
import {
  mockInterestsJson,
  mockServicesJson,
  mockSettingsJson
} from './../../testing/mockData';

jestFetchMock.enableMocks();

fetch.setupDataContextFetches = () => {
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
    url => url.includes('/api/interests?pagination=false'),
    mockInterestsJson
  );
};

// Prevents errors due to node's lack of `window.scrollTo`
window.scrollTo = () => {};
