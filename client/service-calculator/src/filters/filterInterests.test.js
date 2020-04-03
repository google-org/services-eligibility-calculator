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
import { filterInterests } from './filterInterests';

it('returns null for empty people', async () => {
  const filterState = { interests: {} };
  expect(filterInterests(filterState)).toBeNull();
});

it('filters out a service with no interests', async () => {
  const filterState = { interests: { interestId: 'interest' } };
  const filters = [filterInterests(filterState)];
  const service = { interests: [], eligibilityProfiles: [{}] };

  expect(filterService(filters, service)).toBe(false);
});

it('filters out a service with no matching interests', async () => {
  const filterState = {
    interests: { interestId: 'interest', interestId3: 'interest3' }
  };
  const filters = [filterInterests(filterState)];
  const service = {
    interests: [{ '@id': 'interestId2' }, { '@id': 'interestId4' }],
    eligibilityProfiles: [{}]
  };

  expect(filterService(filters, service)).toBe(false);
});

it('filters a service with matching interests', async () => {
  const filterState = {
    interests: { interestId: 'interest', interestId3: 'interest3' }
  };
  const filters = [filterInterests(filterState)];
  const service = {
    interests: [{ '@id': 'interestId' }, { '@id': 'interestId2' }],
    eligibilityProfiles: [{}]
  };

  expect(filterService(filters, service)).toBe(true);
});
