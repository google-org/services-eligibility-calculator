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

import { filterIncome } from './filterIncome';
import { filterService } from '../hooks';

const settings = {
  ami: [79600, 90900, 102300, 113600, 122700, 131800, 140900, 150000],
  fpl: [12490, 16910, 21330, 25750, 30170, 34590, 39010, 43430]
};

it('returns null for empty income', async () => {
  const filterState = { income: undefined };
  expect(filterIncome(filterState, settings)).toBeNull();
});

it('filters out an income above AMI', async () => {
  const filterState = { people: {}, income: 100 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentAMI: 50 }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters an income below AMI', async () => {
  const filterState = { people: {}, income: 10 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentAMI: 50 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out an income above AMI for household', async () => {
  const filterState = { people: { olderAdults: 1 }, income: 40 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentAMI: 50 }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters an income below AMI for household', async () => {
  const filterState = {
    people: { olderAdults: 10 },
    income: 40 /* thousand */
  };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentAMI: 50 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out an income above FPL', async () => {
  const filterState = { people: {}, income: 100 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentFPL: 100 }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters an income below FPL', async () => {
  const filterState = { people: {}, income: 10 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentFPL: 100 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out an income above FPL for household', async () => {
  const filterState = { people: { olderAdults: 1 }, income: 13 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentFPL: 100 }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters an income below FPL for household', async () => {
  const filterState = {
    people: { olderAdults: 10 },
    income: 13 /* thousand */
  };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ percentFPL: 100 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out an income above custom limit', async () => {
  const filterState = { people: {}, income: 100 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ incomeMaxima: [12000] }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters an income below custom limit', async () => {
  const filterState = { people: {}, income: 10 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ incomeMaxima: [12000] }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters an income below custom limit for large household', async () => {
  const filterState = {
    people: { olderAdults: 10 },
    income: 14 /* thousand */
  };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{ incomeMaxima: [12000, 15000] }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters an income without limit', async () => {
  const filterState = { people: {}, income: 100 /* thousand */ };
  const filters = [filterIncome(filterState, settings)];
  const service = { eligibilityProfiles: [{}] };

  expect(filterService(filters, service)).toBe(true);
});
