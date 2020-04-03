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
  mockInterestsJson,
  mockService,
  mockServiceAnalyticsJson,
  mockServiceDraft,
  mockServiceDraftJson
} from '../../../../testing/mockData';

import React from 'react';
import Update from './Update';
import { act } from 'react-dom/test-utils';
import { base64URLEncode } from '../../common/base64URL';
import { getSettings } from '../../../../testing/testHelpers';
import { render } from 'react-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('renders update a service modal', async () => {
  const container = document.createElement('div');

  fetch.resetMocks();
  fetch
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/service_drafts/11ea1d4d-6cd4-b95e-8675-a08cfde838ce?locale=en'
        ),
      mockServiceDraftJson
    )
    .doMockOnceIf(
      url =>
        url.includes(
          '/api/service_drafts/11ea1d4d-6cd4-b95e-8675-a08cfde838ce?locale=es'
        ),
      mockServiceDraftJson
    );
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
  fetch
    .doMockOnceIf(
      url => url.includes('/api/interests?locale=es'),
      mockInterestsJson
    )
    .doMockOnceIf(
      url => url.includes(mockServiceDraft.service + '/analytics'),
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
                  <Update
                    {...props}
                    match={{
                      params: {
                        id: base64URLEncode(
                          'api/service_drafts/11ea1d4d-6cd4-b95e-8675-a08cfde838ce'
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
  // TODO(#494): Re-enable accessibility testing
  //expect(await axe(container)).toHaveNoViolations();
});
