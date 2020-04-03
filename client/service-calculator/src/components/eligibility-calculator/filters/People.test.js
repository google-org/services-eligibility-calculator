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
import People from './People';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, fireEvent, waitForElement } from '@testing-library/react';

expect.extend(toHaveNoViolations);

it('renders button without selected people', async () =>
  act(async () => {
    const { container } = render(<People people={{}} setPeople={() => {}} />);

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal without selected people', async () =>
  act(async () => {
    const { getByText, getByRole } = render(
      <People people={{}} setPeople={() => {}} />
    );

    fireEvent.click(getByText('Add people'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));

it('renders button with selected people', async () =>
  act(async () => {
    const { container } = render(
      <People
        people={{ olderAdults: 1, adults: 2, teens: 3, children: 4 }}
        setPeople={() => {}}
      />
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal with selected people', async () =>
  act(async () => {
    const { getByText, getByRole } = render(
      <People
        people={{ olderAdults: 1, adults: 2, teens: 3, children: 4 }}
        setPeople={() => {}}
      />
    );

    fireEvent.click(getByText('10 people'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));
