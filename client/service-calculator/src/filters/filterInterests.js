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

export function getSelectedInterestNames(interests) {
  return Object.values(interests)
    .filter(s => !!s)
    .sort();
}

export function filterInterests(filterState) {
  const numberOfInterestsSelected = getSelectedInterestNames(
    filterState.interests
  ).length;
  if (numberOfInterestsSelected === 0) {
    return null;
  }

  return service => {
    return (
      service.interests.filter(
        interest => filterState.interests[interest['@id']] !== undefined
      ).length > 0
    );
  };
}
