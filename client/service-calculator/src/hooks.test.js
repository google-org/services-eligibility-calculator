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

import { renderHook, act } from '@testing-library/react-hooks';
import {
  filterService,
  filterEligibilityProfile,
  useRecommendedServices
} from './hooks';
import { createInitialFilterState } from './App';

import React from 'react';
import { DataContext } from './DataContext';

const wrapper = ({ children }) => (
  <DataContext.StateProvider>{children}</DataContext.StateProvider>
);

it('filters out a service with no matching eligibility profiles', async () => {
  const filters = [() => false];
  const service = { eligibilityProfiles: [{}] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters a service with all matching eligibility profiles', async () => {
  const filters = [() => true];
  const service = { eligibilityProfiles: [{}] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters a service with some matching eligibility profiles', async () => {
  const filters = [(service, eligibilityProfile) => eligibilityProfile];
  const service = { eligibilityProfiles: [false, true] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out an eligibilityProfile with no matching filters', async () => {
  const filters = [() => false];

  expect(filterEligibilityProfile(filters, {}, {})).toBe(false);
});

it('filters an eligibilityProfile with matching filters', async () => {
  const filters = [() => true];

  expect(filterEligibilityProfile(filters, {}, {})).toBe(true);
});

it('filters out an eligibilityProfile with some matching filters', async () => {
  const filters = [() => true, () => false];

  expect(filterEligibilityProfile(filters, {}, {})).toBe(false);
});

it('Filters without active search', async () => {
  fetch.setupDataContextFetches();

  await act(async () => {
    const { result, waitForValueToChange } = renderHook(
      () =>
        useRecommendedServices(
          {
            income: 1,
            interests: {},
            people: {}
          },
          ''
        ),
      { wrapper }
    );

    await waitForValueToChange(
      () =>
        result.current != null &&
        result.current.recommendedServices != null &&
        result.current.recommendedServices.length > 0
    );

    expect(result.error).toBeUndefined();
    expect(result.current.allServices).toBeUndefined();
    expect(result.current.recommendedServices.length).toBeGreaterThan(0);
  });
});

it('Searches without active filters', async () => {
  fetch.setupDataContextFetches();

  await act(async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useRecommendedServices(createInitialFilterState(), 'senior'),
      { wrapper }
    );
    await waitForValueToChange(
      () =>
        result.current != null &&
        result.current.recommendedServices != null &&
        result.current.recommendedServices.length > 0
    );

    expect(result.error).toBeUndefined();
    expect(result.current.allServices).toBeUndefined();
    expect(result.current.otherServices.length).toBeGreaterThan(0);
    expect(result.current.recommendedServices.length).toBeGreaterThan(0);
  });
});

it('Recommends no services without active filters or search', async () => {
  fetch.setupDataContextFetches();

  await act(async () => {
    const { result, waitForValueToChange } = renderHook(
      () => useRecommendedServices(createInitialFilterState(), ''),
      { wrapper }
    );

    await waitForValueToChange(
      () =>
        result.current != null &&
        result.current.allServices != null &&
        result.current.allServices.length > 0
    );

    expect(result.error).toBeUndefined();
    expect(result.current.allServices.length).toBeGreaterThan(0);
    expect(result.current.otherServices).toBeUndefined();
    expect(result.current.recommendedServices).toBeUndefined();
  });
});
