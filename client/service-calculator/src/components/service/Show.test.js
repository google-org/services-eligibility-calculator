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

import { FilterContext, createInitialFilterState } from '../../App';
import { MemoryRouter, Route } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

import React from 'react';
import Show from './Show';
import { act } from 'react-dom/test-utils';
import { base64URLEncode } from '../../common/base64URL';
import { render } from 'react-dom';
import { DataContext } from '../../DataContext';

expect.extend(toHaveNoViolations);

const filterState = createInitialFilterState();

it('renders show a service modal', async () => {
  const container = document.createElement('div');

  fetch.setupDataContextFetches();

  await act(async () => {
    return render(
      <MemoryRouter>
        <DataContext.StateProvider>
          <FilterContext.Provider value={{ filterState }}>
            <Route
              component={props => (
                <Show
                  {...props}
                  match={{
                    params: {
                      id: base64URLEncode('/api/services/0')
                    }
                  }}
                />
              )}
            />
          </FilterContext.Provider>
        </DataContext.StateProvider>
      </MemoryRouter>,
      container
    );
  });

  expect(container).toMatchSnapshot();
  expect(await axe(container)).toHaveNoViolations();
});
