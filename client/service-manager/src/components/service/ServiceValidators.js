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

import { defaultLocale, locales } from '../../Locales';

import sanitizeHtml from 'sanitize-html';

const textOnlyConfig = {
  allowedTags: []
};

// All text-field character limits will be increased by this when not in default language
const charLimitIncreaseForTranslations = 200;

export const phoneNumberRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.]?([0-9]{4})$/;
export const urlRegex = /(^https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?]\S*)?$/;
export const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const emailValidator = value =>
  value &&
  (value.trim().match(emailRegex) ? undefined : `Not a valid email address`);

export const urlValidator = value =>
  value && (value.trim().match(urlRegex) ? undefined : `Not a valid URL`);

export const phoneNumberValidator = value =>
  value &&
  (value.trim().match(phoneNumberRegex)
    ? undefined
    : `Not a valid phone number`);

export const maxLengthValidator = maxLength => (value, isDefaultLocale) => {
  const maxLengthForLocale = isDefaultLocale
    ? maxLength
    : maxLength + charLimitIncreaseForTranslations;
  return (
    value &&
    (value.length <= maxLengthForLocale
      ? undefined
      : `${value.length -
          maxLengthForLocale} characters over the ${maxLengthForLocale} character limit`)
  );
};

export const maxLengthHtmlValidator = maxLength => (value, isDefaultLocale) => {
  const maxLengthForLocale = isDefaultLocale
    ? maxLength
    : maxLength + charLimitIncreaseForTranslations;
  const sanitizedValue = value && sanitizeHtml(value, textOnlyConfig);
  return (
    sanitizedValue &&
    (sanitizedValue.length <= maxLengthForLocale
      ? undefined
      : `${sanitizedValue.length -
          maxLengthForLocale} characters over the ${maxLengthForLocale} character limit`)
  );
};

export const composeValidators = (...validators) => (value, isDefaultLocale) =>
  validators.reduce(
    (error, validator) => error || validator(value, isDefaultLocale),
    undefined
  );

const requiredFieldValidators = {
  name: value => (value && value.length > 0 ? undefined : 'Name is required'),
  applicationOnline: value =>
    value && value.length > 0 ? undefined : 'Learn more website is required'
};

const serviceFieldValidators = {
  name: maxLengthValidator(80),
  description: maxLengthHtmlValidator(300),
  details: maxLengthHtmlValidator(500),
  eligibilityProfiles: () => undefined, // here for validation order
  applicationOnline: composeValidators(urlValidator, maxLengthValidator(300)),
  applicationDocuments: maxLengthHtmlValidator(300),
  applicationPhone: composeValidators(
    phoneNumberValidator,
    maxLengthValidator(300)
  ),
  applicationPhoneOther: maxLengthValidator(300),
  contactEmail: composeValidators(emailValidator, maxLengthValidator(300)),
  applicationWebAddresses: composeValidators(
    urlValidator,
    maxLengthValidator(300)
  ),
  applicationAddress: maxLengthValidator(300),
  applicationHours: maxLengthValidator(300)
};

const eligibilityProfileValidators = {
  fees: maxLengthValidator(300),
  other: maxLengthHtmlValidator(500)
};

function validateRequiredServiceFields(service, isDefaultLocale) {
  let errors = {};
  for (const [fieldName, validator] of Object.entries(
    requiredFieldValidators
  )) {
    const error = validator(service[fieldName], isDefaultLocale);
    error && (errors[fieldName] = error);
  }
  return errors;
}

// All service validation except for required fields
function validateServiceFields(service, isDefaultLocale) {
  let errors = {};

  // Validate top-level fields.
  for (const [fieldName, validator] of Object.entries(serviceFieldValidators)) {
    // Validate each of the service eligibility profile fields.
    if (fieldName === 'eligibilityProfiles') {
      for (const [index, profile] of Object.entries(
        service.eligibilityProfiles
      )) {
        let eligibilityProfileErrors = {};
        for (const [fieldName, validator] of Object.entries(
          eligibilityProfileValidators
        )) {
          const error = validator(profile[fieldName], isDefaultLocale);
          error && (eligibilityProfileErrors[fieldName] = error);
        }
        if (Object.keys(eligibilityProfileErrors).length > 0) {
          if (!errors.eligibilityProfiles) {
            errors.eligibilityProfiles = [];
          }
          errors.eligibilityProfiles[index] = eligibilityProfileErrors;
        }
      }

      continue;
    }

    // Validate each of the web addresses
    if (fieldName === 'applicationWebAddresses') {
      for (const [index, url] of Object.entries(service[fieldName])) {
        const error = validator(url, isDefaultLocale);
        if (error) {
          if (!errors[fieldName]) {
            errors[fieldName] = [];
          }
          errors[fieldName][index] = error;
        }
      }
      continue;
    }

    const error = validator(service[fieldName], isDefaultLocale);
    error && (errors[fieldName] = error);
  }

  return errors;
}

/**
 * Validates a service entity in the default locale, returning an error dictionary with
 * errors for each field (if any).
 */
export function validateDefaultLocaleService(service) {
  const requiredFieldErrors = validateRequiredServiceFields(
    service,
    /* isDefaultLocale */ true
  );
  const otherErrors = validateServiceFields(
    service,
    /* isDefaultLocale */ true
  );
  const errors = { ...requiredFieldErrors, ...otherErrors };
  return Object.keys(errors).length > 0 ? errors : undefined;
}

/**
 * Validates a translated service entity, returning an error dictionary with
 * errors for each field (if any). Skips validating required fields, since
 * will default to defaultLocale values.
 */
export function validateTranslatedService(service) {
  const errors = validateServiceFields(service, /* isDefaultLocale */ false);
  return Object.keys(errors).length > 0 ? errors : undefined;
}

/**
 * Validates a service entity in all languages, returning an error dictionary with
 * errors for each field (if any) in each language.
 */
export function validateServiceTranslations(translations) {
  const errorDict = {};
  locales.forEach(loc => {
    let errors;
    if (loc.locale === defaultLocale) {
      errors = validateDefaultLocaleService(translations[loc.locale]);
    } else {
      errors = validateTranslatedService(translations[loc.locale]);
    }
    if (errors) errorDict[loc.locale] = errors;
  });
  return Object.keys(errorDict).length > 0 ? errorDict : undefined;
}
