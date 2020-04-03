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

import { getTotalPeople } from './filterAge';

export function filterIncome(filterState, settings) {
  if (filterState.income === undefined) {
    return null;
  }

  return (service, eligibilityProfile) => {
    if (!settings) {
      return true;
    }

    const incomeInUSD = filterState.income * 1000;

    // Default household size to 1;
    const householdSize = Math.max(getTotalPeople(filterState.people), 1);

    if (eligibilityProfile.percentAMI != null) {
      // Input type AMI
      const index = Math.min(householdSize, settings.ami.length) - 1;

      return (
        incomeInUSD <=
        settings.ami[index] * (eligibilityProfile.percentAMI / 100.0)
      );
    } else if (eligibilityProfile.percentFPL != null) {
      // Input type FPL
      const index = Math.min(householdSize, settings.fpl.length) - 1;

      return (
        incomeInUSD <=
        settings.fpl[index] * (eligibilityProfile.percentFPL / 100.0)
      );
    } else if (
      eligibilityProfile.incomeMaxima != null &&
      eligibilityProfile.incomeMaxima.length > 0
    ) {
      // Input type custom
      const index =
        Math.min(householdSize, eligibilityProfile.incomeMaxima.length) - 1;

      return incomeInUSD <= (eligibilityProfile.incomeMaxima[index] || 0);
    } else {
      // Income type not required
      return true;
    }
  };
}
