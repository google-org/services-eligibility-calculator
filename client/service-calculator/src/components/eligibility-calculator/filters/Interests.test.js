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

import React from 'react';
import { act } from 'react-dom/test-utils';
import Interests from './Interests';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { DataContext } from '../../../DataContext';

expect.extend(toHaveNoViolations);

it('renders button without selected interests', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container } = render(
      <DataContext.StateProvider>
        <Interests selectedInterests={{}} setSelectedInterests={() => {}} />
      </DataContext.StateProvider>
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal without selected interests', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { getByText, getByRole } = render(
      <DataContext.StateProvider>
        <Interests selectedInterests={{}} setSelectedInterests={() => {}} />
      </DataContext.StateProvider>
    );

    fireEvent.click(getByText('Add interests'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));

it('renders button with a selected interest', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container } = render(
      <DataContext.StateProvider>
        <Interests
          selectedInterests={{ '/api/interests/1': 'Interest1' }}
          setSelectedInterests={() => {}}
        />
      </DataContext.StateProvider>
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal with a selected interest', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { getByText, getByRole } = render(
      <DataContext.StateProvider>
        <Interests
          selectedInterests={{ '/api/interests/1': 'Interest1' }}
          setSelectedInterests={() => {}}
        />
      </DataContext.StateProvider>
    );

    fireEvent.click(getByText('Interest1'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));
