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

import { AGE_RANGE_BY_GROUP } from '../common/utils/constants';

export function getTotalPeople(people) {
  return Object.values(people).reduce(
    (accumulator, currentValue) => currentValue + accumulator,
    0
  );
}

export function filterAge(filterState) {
  const totalPeople = getTotalPeople(filterState.people);
  if (totalPeople === 0) return null;

  return (service, eligibilityProfile) => {
    return doAgesMatchProfile(filterState.people, eligibilityProfile);
  };
}

export function doAgesMatchProfile(people, profile) {
  if (profile.ageMax === null && profile.ageMin === null) {
    return true;
  }
  const groups = Object.keys(people).filter(g => people[g] > 0);
  const ranges = groups.map(g => AGE_RANGE_BY_GROUP[g]);
  const eligibilityRange = [
    profile.ageMin == null ? 0 : profile.ageMin,
    profile.ageMax == null ? Number.MAX_VALUE : profile.ageMax
  ];
  return ranges.reduce(
    (accumulator, currentRange) =>
      accumulator || doRangesOverlap(currentRange, eligibilityRange),
    false
  );
}
export function doRangesOverlap(range1, range2) {
  return range1[0] <= range2[1] && range2[0] <= range1[1];
}
