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

import { AGE_SLIDER_MAX, AGE_SLIDER_MIN } from './form/EligibilityProfiles';

import pick from 'lodash/pick';

/** Cleans eligibility values for submittal */
const cleanEligibilityValues = (values, index) => {
  let copyOfValues = { ...values };

  let fieldsToSetNull = ['other', 'rules', 'fees'];
  fieldsToSetNull.forEach(field => {
    if (!copyOfValues[field]) copyOfValues[field] = null;
  });

  if (copyOfValues.ageMin === AGE_SLIDER_MIN) {
    copyOfValues.ageMin = null;
  }
  if (copyOfValues.ageMax === AGE_SLIDER_MAX) {
    copyOfValues.ageMax = null;
  }
  copyOfValues.profileIndex = index;

  return copyOfValues;
};

/** Cleans values for service submittal */
export default function cleanValues(values) {
  let copyOfValues = { ...values };

  // Set all empty fields to null such that they are explicitly cleared.
  let fieldsToSetNull = [
    'applicationAddress',
    'applicationHours',
    'applicationDocuments',
    'applicationOnline',
    'applicationPhone',
    'applicationPhoneOther',
    'applicationWindowStart',
    'applicationWindowEnd',
    'contactEmail',
    'department',
    'description',
    'details'
  ];
  fieldsToSetNull.forEach(field => {
    if (!copyOfValues[field]) copyOfValues[field] = null;
  });

  copyOfValues.eligibilityProfiles = copyOfValues.eligibilityProfiles.map(
    cleanEligibilityValues
  );
  copyOfValues.applicationWebAddresses =
    copyOfValues.applicationWebAddresses &&
    copyOfValues.applicationWebAddresses.filter(url => !!url);
  if (
    copyOfValues.applicationWebAddresses &&
    copyOfValues.applicationWebAddresses.length === 0
  ) {
    copyOfValues.applicationWebAddresses = null;
  }

  copyOfValues.department =
    (copyOfValues.department && copyOfValues.department['@id']) ||
    copyOfValues.department;
  copyOfValues.interests =
    copyOfValues.interests && copyOfValues.interests.map(i => i['@id'] || i);
  copyOfValues.service =
    (copyOfValues.service && copyOfValues.service['@id']) ||
    copyOfValues.service;

  return copyOfValues;
}

export const translatableFieldsArray = [
  'name',
  'description',
  'details',
  'applicationAddress',
  'applicationHours',
  'applicationPhone',
  'applicationPhoneOther',
  'contactEmail',
  'applicationOnline',
  'applicationWebAddresses',
  'applicationDocuments',
  'fees',
  'other'
];

export const translatableFields = new Set(translatableFieldsArray);

/** Returns true if the field with the given fieldName is translatable, false otherwise. */
export function fieldIsTranslatable(fieldName) {
  if (fieldName.lastIndexOf('.') !== -1) {
    fieldName = fieldName.substring(fieldName.lastIndexOf('.') + 1);
  }
  if (fieldName.indexOf('[') !== -1) {
    fieldName = fieldName.substring(0, fieldName.indexOf('['));
  }
  return translatableFields.has(fieldName);
}

function filterValues(values) {
  const fieldsToKeep = Object.keys(values).filter(fieldIsTranslatable);
  fieldsToKeep.push('@id');
  fieldsToKeep.push('profileIndex');
  const filtered = pick(values, fieldsToKeep);
  return filtered;
}

/** Filters values to only include those fields that are translatable */
export function filterForTranslatableValues(values) {
  const filteredEligibility =
    values.eligibilityProfiles &&
    values.eligibilityProfiles.map(profile => filterValues(profile));
  let filtered = filterValues(values);
  filtered.eligibilityProfiles = filteredEligibility;
  return filtered;
}

/**
 * Sets IDs of translatedProfiles from the corresponding defaultLocaleProfiles.
 * Ensures there are as many translatedProfiles as defaultLocaleProfiles
 * (will only have ID set if not present in input translatedProfiles) and
 * returns the new set of translated eligibility profiles.
 */
export function getTranslatedEligibilityProfiles(
  defaultLocaleProfiles,
  translatedProfiles
) {
  // Map of translatedProfiles from index to the profile
  const profileIndicesToIds = new Map();
  translatedProfiles &&
    translatedProfiles.forEach(profile => {
      profileIndicesToIds.set(profile.profileIndex, profile);
    });

  const profiles = [];
  defaultLocaleProfiles &&
    defaultLocaleProfiles.forEach(defaultProfile => {
      let translatedProfile = {};
      if (profileIndicesToIds.has(defaultProfile.profileIndex)) {
        translatedProfile = profileIndicesToIds.get(
          defaultProfile.profileIndex
        );
      }
      // Set profile Ids to those of the default locale to ensure update correct profile with translation
      translatedProfile['@id'] = defaultProfile['@id'];
      profiles.push(translatedProfile);
    });
  return profiles;
}
