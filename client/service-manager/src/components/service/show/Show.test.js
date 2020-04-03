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

import { AuthContext, SettingsContext, ToastContext } from '../../../App';
import { MemoryRouter, Route } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import {
  mockService,
  mockServiceAnalyticsJson,
  mockServiceJson
} from '../../../../../testing/mockData';

import React from 'react';
import ShowPublished from './ShowPublished';
import { act } from 'react-dom/test-utils';
import { base64URLEncode } from '../../../common/base64URL';
import { getSettings } from '../../../../../testing/testHelpers';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders show a service view', async () => {
  const container = document.createElement('div');

  fetch.resetMocks();
  fetch
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/services/11ea1d4d-6cd4-b95e-8675-a08cfde838ce?locale=en'
        ),
      mockServiceJson
    )
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/services/11ea1d4d-6cd4-b95e-8675-a08cfde838ce?locale=es'
        ),
      mockServiceJson
    )
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/services/11ea1d4d-6cd4-b95e-8675-a08cfde838ce/analytics'
        ),
      mockServiceAnalyticsJson
    );

  await act(async () => {
    const settings = getSettings();
    return render(
      <MemoryRouter>
        <SettingsContext.Provider value={{ settings }}>
          <AuthContext.Provider
            value={{
              isLoggedIn: true,
              loggedInUser: { username: mockService.lastModifiedBy }
            }}
          >
            <ToastContext.Provider
              value={{ toastMessage: null, setToastMessage: () => {} }}
            >
              <Route
                component={props => (
                  <ShowPublished
                    {...props}
                    match={{
                      params: {
                        id: base64URLEncode(
                          'api/services/11ea1d4d-6cd4-b95e-8675-a08cfde838ce'
                        )
                      }
                    }}
                  />
                )}
              />
            </ToastContext.Provider>
          </AuthContext.Provider>
        </SettingsContext.Provider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
});
