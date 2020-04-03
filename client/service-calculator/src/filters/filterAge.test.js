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

import { filterService } from '../hooks';
import { filterAge } from './filterAge';

it('returns null for empty people', async () => {
  const filterState = { people: {} };
  expect(filterAge(filterState)).toBeNull();
});

it('filters a service with no age requirements', async () => {
  const filterState = { people: { olderAdults: 1 } };
  const filters = [filterAge(filterState)];
  const service = { eligibilityProfiles: [{ ageMax: null, ageMin: null }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out service with age requirements', async () => {
  const filterState = { people: { adults: 1 } };
  const filters = [filterAge(filterState)];
  const service = { eligibilityProfiles: [{ ageMax: 17, ageMin: 0 }] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters a service with age requirements', async () => {
  const filterState = { people: { teens: 1 } };
  const filters = [filterAge(filterState)];
  const service = { eligibilityProfiles: [{ ageMax: 17, ageMin: 0 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters a service with only minimum age', async () => {
  const filterState = { people: { olderAdults: 1 } };
  const filters = [filterAge(filterState)];
  const service = { eligibilityProfiles: [{ ageMax: null, ageMin: 62 }] };

  expect(filterService(filters, service)).toBe(true);
});

it('filters out a service with only minimum age', async () => {
  const filterState = { people: { children: 1 } };
  const filters = [filterAge(filterState)];
  const service = { eligibilityProfiles: [{ ageMax: null, ageMin: 62 }] };

  expect(filterService(filters, service)).toBe(false);
});
