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

import { AuthContext } from '../../App';
import List from './List';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mockDepartmentsJson } from '../../../../testing/mockData';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders list departments view', async () => {
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

  await act(async () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn: true,
            loggedInUser: { username: 'admin', roles: ['ROLE_ADMIN'] }
          }}
        >
          <List />
        </AuthContext.Provider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
});
