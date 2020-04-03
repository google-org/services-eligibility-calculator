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
import { fireEvent, render, waitForElement } from '@testing-library/react';

import Address from './Address';
import React from 'react';
import { act } from 'react-dom/test-utils';

expect.extend(toHaveNoViolations);

it('renders button without selected resident state', async () =>
  act(async () => {
    const { container } = render(
      <Address resident={undefined} setResident={() => {}} />
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal without selected resident state', async () =>
  act(async () => {
    const { getByText, getByRole } = render(
      <Address resident={undefined} setResident={() => {}} />
    );

    fireEvent.click(getByText('Add address'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));

it('renders button with selected resident state', async () =>
  act(async () => {
    const { container } = render(
      <Address resident={true} setResident={() => {}} />
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal with selected resident state', async () =>
  act(async () => {
    const { getByText, getByRole } = render(
      <Address resident={true} setResident={() => {}} />
    );

    fireEvent.click(getByText('In City'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));

it('renders button with selected not resident state', async () =>
  act(async () => {
    const { container } = render(
      <Address resident={false} setResident={() => {}} />
    );

    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  }));

it('renders modal with selected not resident state', async () =>
  act(async () => {
    const { getByText, getByRole } = render(
      <Address resident={false} setResident={() => {}} />
    );

    fireEvent.click(getByText('Not in City'));

    const modal = await waitForElement(() => getByRole('document'));

    expect(modal).toMatchSnapshot();
    expect(await axe(modal)).toHaveNoViolations();
  }));
