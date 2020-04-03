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
  fireEvent,
  render,
  waitForElement,
  within
} from '@testing-library/react';

import App from './App';
import React from 'react';
import { act } from 'react-dom/test-utils';

expect.extend(toHaveNoViolations);

it('renders without crashing', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container, getByText } = render(<App testMode={true} />);

    await waitForElement(() => getByText('Senior Center Fitness Discounts'));

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders after a search for name', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container, getByText, getByLabelText, getByTestId } = render(
      <App testMode={true} />
    );

    await waitForElement(() => getByText('Senior Center Fitness Discounts'));
    let searchBox = await waitForElement(() => getByLabelText('Search'));
    fireEvent.change(searchBox, { target: { value: 'Senior Center' } });
    let recommendedServices = await waitForElement(() =>
      getByTestId('service-list-recommended')
    );
    let matches = within(recommendedServices).getAllByText(
      'Senior Center Fitness Discounts'
    );
    expect(matches.length).toBe(1);

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders after a search for interest', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container, getByText, getByLabelText, getByTestId } = render(
      <App testMode={true} />
    );

    await waitForElement(() => getByText('Food Tax Rebate Program'));
    let searchBox = await waitForElement(() => getByLabelText('Search'));
    fireEvent.change(searchBox, { target: { value: 'Food' } });
    let recommendedServices = await waitForElement(() =>
      getByTestId('service-list-recommended')
    );
    let matches = within(recommendedServices).getAllByText(
      'Food Tax Rebate Program'
    );
    expect(matches.length).toBe(1);

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders clear selections after search with no matches', async () =>
  act(async () => {
    fetch.setupDataContextFetches();

    const { container, getByText, getByLabelText, getByTestId } = render(
      <App testMode={true} />
    );

    await waitForElement(() => getByText('Food Tax Rebate Program'));
    let searchBox = await waitForElement(() => getByLabelText('Search'));
    fireEvent.change(searchBox, {
      target: { value: 'abcdefghijklmnopqrstuvwxyz' }
    });
    let recommendedServices = await waitForElement(() =>
      getByTestId('service-list-recommended')
    );
    let matches = within(recommendedServices).getAllByText(
      'Clear selections to see more services'
    );
    expect(matches.length).toBe(1);

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));
