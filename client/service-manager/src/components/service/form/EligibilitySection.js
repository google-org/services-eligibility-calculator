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

import FormSection, { FieldArray } from './FormSection';
import React, { useContext } from 'react';

import EligibilityProfiles from './EligibilityProfiles';
import { LanguageFormsContext } from './LanguageForms';
import PropTypes from 'prop-types';
import { defaultLocale } from '../../../Locales';
import { useTranslation } from 'react-i18next';

/**
 * Renders the "Eligibility" section of the form.
 */
export default function EligibilitySection({
  form,
  values,
  addEligibilityProfile,
  removeEligibilityProfile
}) {
  const addEligibilityProfileForm = form => {
    addEligibilityProfile();
    form.mutators.push('eligibilityProfiles', {
      incomeMaxima: []
    });
  };
  const { locale } = useContext(LanguageFormsContext);
  const { t } = useTranslation();

  return (
    <FormSection title={t('serviceDetails.eligibilityCard.whoIsEligible')}>
      {(!values.eligibilityProfiles ||
        values.eligibilityProfiles.length === 0) &&
        addEligibilityProfileForm(form)}
      <FieldArray
        component={EligibilityProfiles}
        name="eligibilityProfiles"
        form={form}
        removeEligibilityProfile={removeEligibilityProfile}
      />
      <button
        className="btn btn-blue-text"
        onClick={e => {
          e.preventDefault();
          addEligibilityProfileForm(form);
        }}
        disabled={locale !== defaultLocale}
        hidden={locale !== defaultLocale}
      >
        + Add another profile
      </button>
    </FormSection>
  );
}

EligibilitySection.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  addEligibilityProfile: PropTypes.func.isRequired,
  removeEligibilityProfile: PropTypes.func.isRequired
};
