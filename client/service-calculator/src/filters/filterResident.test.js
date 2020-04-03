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
import { filterResident } from './filterResident';

it('returns null for empty residency', async () => {
  const filterState = {};
  expect(filterResident(filterState)).toBeNull();
});

it('filters out a service with residency requirement for non resident', async () => {
  const filterState = { resident: false };
  const filters = [filterResident(filterState)];
  const service = {
    interests: [],
    eligibilityProfiles: [{ residentRequired: true }]
  };

  expect(filterService(filters, service)).toBe(false);
});

it('filters a service with residency requirement for a resident', async () => {
  const filterState = { resident: true };
  const filters = [filterResident(filterState)];
  const service = {
    interests: [],
    eligibilityProfiles: [{ residentRequired: true }]
  };

  expect(filterService(filters, service)).toBe(true);
});

it('filters a service without residency requirement for non resident', async () => {
  const filterState = { resident: false };
  const filters = [filterResident(filterState)];
  const service = {
    interests: [],
    eligibilityProfiles: [{ residentRequired: false }]
  };

  expect(filterService(filters, service)).toBe(true);
});

it('filters a service without residency requirement for a resident', async () => {
  const filterState = { resident: true };
  const filters = [filterResident(filterState)];
  const service = {
    interests: [],
    eligibilityProfiles: [{ residentRequired: false }]
  };

  expect(filterService(filters, service)).toBe(true);
});
