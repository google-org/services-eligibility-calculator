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

import React from 'react';
import Share from './Share';
import { ToastContext } from '../../App';
import { act } from 'react-dom/test-utils';
import { getModal } from '../../../../testing/testHelpers';
import { render } from 'react-dom';

expect.extend(toHaveNoViolations);

it('renders share a service modal', async () => {
  const container = document.createElement('div');

  await act(async () => {
    render(
      <ToastContext.Provider
        value={{ toastMessage: null, setToastMessage: () => {} }}
      >
        <Share
          onCancel={() => {}}
          serviceName="serviceName"
          serviceUrl="serviceUrl"
        />
      </ToastContext.Provider>,
      container
    );
  });

  expect(getModal()).toMatchSnapshot();
  expect(await axe(getModal())).toHaveNoViolations();
});
