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

import { AuthContext, SettingsContext, ToastContext } from '../../App';
import { MemoryRouter, Route } from 'react-router';
import {
  mockDepartmentsJson,
  mockInterestsJson
} from '../../../../testing/mockData';

import Create from './Create';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { getSettings } from '../../../../testing/testHelpers';
import { render } from 'react-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('renders create a service modal', async () => {
  const container = document.createElement('div');

  fetch.resetMocks();
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=en'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/departments?locale=es'),
    mockDepartmentsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=en'),
    mockInterestsJson
  );
  fetch.doMockOnceIf(
    url => url.includes('/api/interests?locale=es'),
    mockInterestsJson
  );

  await act(async () => {
    const settings = getSettings();
    return render(
      <MemoryRouter>
        <SettingsContext.Provider value={{ settings }}>
          <AuthContext.Provider
            value={{
              isLoggedIn: true,
              loggedInUser: { username: 'user' }
            }}
          >
            <ToastContext.Provider
              value={{ toastMessage: null, setToastMessage: () => {} }}
            >
              <Route component={props => <Create {...props} />} />
            </ToastContext.Provider>
          </AuthContext.Provider>
        </SettingsContext.Provider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  // TODO(#494): Re-enable accessibility testing
  //expect(await axe(container)).toHaveNoViolations();
});
