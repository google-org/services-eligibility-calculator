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

import { AuthContext, SettingsContext } from '../../../App';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  mockArchivedServicesJson,
  mockServiceDraftsJson,
  mockServicesJson
} from '../../../../../testing/mockData';

import List from './List';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getSettings } from '../../../../../testing/testHelpers';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders list services view', async () => {
  const container = document.createElement('div');

  fetch.resetMocks();
  fetch
    .doMockOnceIf(
      url => url.includes('/api/service_drafts'),
      mockServiceDraftsJson
    )
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/services?pagination=false&exists[archivedDateTime]=false'
        ),
      mockServicesJson
    )
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/services?pagination=false&exists[archivedDateTime]=true'
        ),
      mockArchivedServicesJson
    );

  await act(async () => {
    render(
      <MemoryRouter>
        <SettingsContext.Provider value={getSettings()}>
          <AuthContext.Provider
            value={{
              isLoggedIn: true,
              loggedInUser: { username: 'user' }
            }}
          >
            <List match={{ params: {} }} />
          </AuthContext.Provider>
        </SettingsContext.Provider>{' '}
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
  expect(container.innerHTML).toContain('You');
});
