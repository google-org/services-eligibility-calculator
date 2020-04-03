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

import {
  INCOME_TYPE_AMI,
  INCOME_TYPE_CUSTOM,
  INCOME_TYPE_FPL,
  INCOME_TYPE_NOT_REQUIRED
} from './IncomeTypes';
import RadioButton, { YesNoRadio } from './RadioButton';
import React, { useContext } from 'react';

import { Field } from './FormSection';
import HtmlEditor from './HtmlEditor';
import IncomeGrid from './IncomeGrid';
import Label from './Label';
import { LanguageFormsContext } from './LanguageForms';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import TextBox from './TextBox';
import ValueLabel from '@material-ui/core/Slider/ValueLabel';
import { defaultLocale } from '../../../Locales';
import { useTranslation } from 'react-i18next';

export const AGE_SLIDER_MIN = 0;
export const AGE_SLIDER_MAX = 99;

const ServiceAgeLabel = props => {
  let value = props.value;
  if (value === AGE_SLIDER_MAX) {
    value += '+';
  }
  return <ValueLabel {...props} value={value} />;
};

const EligibilityProfile = ({
  profileValue,
  profileItem,
  index,
  onAgeUpdated,
  onIncomeTypeUpdated,
  form,
  showRemove,
  removeEligibilityProfile
}) => {
  const removeEligibilityProfileForm = (form, index) => {
    removeEligibilityProfile(index);
    form.mutators.remove('eligibilityProfiles', index);
  };
  const { locale } = useContext(LanguageFormsContext);
  const { t } = useTranslation();

  let incomeType = null;
  if (profileValue.percentAMI !== null) {
    incomeType = INCOME_TYPE_AMI;
  } else if (profileValue.percentFPL !== null) {
    incomeType = INCOME_TYPE_FPL;
  } else if (profileValue.incomeMaxima.length > 0) {
    incomeType = INCOME_TYPE_CUSTOM;
  } else {
    incomeType = INCOME_TYPE_NOT_REQUIRED;
  }

  const updateIncomeType = newType => {
    let initial = null;
    switch (newType) {
      case INCOME_TYPE_AMI:
        initial = { percentAMI: '' };
        break;
      case INCOME_TYPE_FPL:
        initial = { percentFPL: '' };
        break;
      case INCOME_TYPE_CUSTOM:
        initial = { incomeMaxima: [''] };
        break;
      default:
        break;
    }
    onIncomeTypeUpdated(initial);
  };

  return (
    <>
      {showRemove && (
        <div className=" eligibility-profile-remove">
          <button
            className="btn btn-blue-text"
            onClick={() => removeEligibilityProfileForm(form, index)}
            disabled={locale !== defaultLocale}
            hidden={locale !== defaultLocale}
            type="button"
          >
            <i className="material-icons align-middle">close</i>
          </button>
        </div>
      )}
      <div className="form group row slider">
        <Label
          label={t('serviceDetails.eligibilityCard.ageOfApplicant')}
          for="age_slider"
        />
        <div className="col-12 col-md-9 mt-4 px-4">
          <Slider
            ValueLabelComponent={ServiceAgeLabel}
            id="service_age_slider"
            className="col"
            value={[
              profileValue.ageMin ? profileValue.ageMin : AGE_SLIDER_MIN,
              profileValue.ageMax ? profileValue.ageMax : AGE_SLIDER_MAX
            ]}
            min={AGE_SLIDER_MIN}
            max={AGE_SLIDER_MAX}
            step={1}
            valueLabelDisplay="on"
            onChange={(_, value) => {
              onAgeUpdated(value[0], value[1]);
            }}
            getAriaLabel={ind =>
              ind === 0
                ? t('serviceDetails.eligibilityCard.eligibilityAgeMin')
                : t('serviceDetails.eligibilityCard.eligibilityAgeMax')
            }
            disabled={locale !== defaultLocale}
          ></Slider>
        </div>
      </div>
      <div className={`form-group row`}>
        <Label
          label={t('serviceDetails.eligibilityCard.maxIncomeLabel')}
          for={'income_' + index}
        />
        <div
          className="col-12 col-md-9"
          id={'service_income_' + index}
          role="radiogroup"
          aria-label={'Eligibility profile ' + index + ' maximum income'}
        >
          <RadioButton
            type="radio"
            name={'service_income_' + index}
            label={t('serviceDetails.eligibilityCard.useAMI')}
            aria-labelledby={'service_income_' + index}
            checked={incomeType === INCOME_TYPE_AMI}
            onChange={() => updateIncomeType(INCOME_TYPE_AMI)}
            disabled={locale !== defaultLocale}
          />
          {incomeType === INCOME_TYPE_AMI && (
            <IncomeGrid
              incomeType={incomeType}
              profileValue={profileValue}
              profileItem={profileItem}
            />
          )}
          <RadioButton
            type="radio"
            name={'service_income_' + index}
            label={t('serviceDetails.eligibilityCard.useFPL')}
            aria-labelledby={'service_income_' + index}
            checked={incomeType === INCOME_TYPE_FPL}
            onChange={() => updateIncomeType(INCOME_TYPE_FPL)}
            disabled={locale !== defaultLocale}
          />
          {incomeType === INCOME_TYPE_FPL && (
            <IncomeGrid
              incomeType={incomeType}
              profileValue={profileValue}
              profileItem={profileItem}
            />
          )}
          <RadioButton
            type="radio"
            name={'service_income_' + index}
            label={t('serviceDetails.eligibilityCard.enterCustom')}
            aria-labelledby={'service_income_' + index}
            checked={incomeType === INCOME_TYPE_CUSTOM}
            onChange={() => updateIncomeType(INCOME_TYPE_CUSTOM)}
            disabled={locale !== defaultLocale}
          />
          {incomeType === INCOME_TYPE_CUSTOM && (
            <IncomeGrid
              incomeType={incomeType}
              profileValue={profileValue}
              profileItem={profileItem}
            />
          )}
          <RadioButton
            type="radio"
            name={'service_income_' + index}
            label={t('serviceDetails.eligibilityCard.noIncomeRequirement')}
            aria-labelledby={'service_income_' + index}
            checked={incomeType === INCOME_TYPE_NOT_REQUIRED}
            onChange={() => updateIncomeType(INCOME_TYPE_NOT_REQUIRED)}
            disabled={locale !== defaultLocale}
          />
        </div>
      </div>
      <Field
        component={TextBox}
        label={t('serviceDetails.eligibilityCard.fees')}
        name={`${profileItem}.fees`}
        placeholder="Any fee (application fee, class fee, etc.) or prerequisite (e.g. own electric vehicle.) If no fees, leave blank."
      />
      <YesNoRadio
        label={t('serviceDetails.eligibilityCard.cityResident')}
        name={`${profileItem}.residentRequired`}
      />
      <YesNoRadio
        label={t('serviceDetails.eligibilityCard.legalUSResidency')}
        name={`${profileItem}.citizenRequired`}
      />
      <Field
        component={HtmlEditor}
        label={t('serviceDetails.eligibilityCard.other')}
        name={`${profileItem}.other`}
        placeholder="Any details not outlined above"
      />
      <hr />
    </>
  );
};

export default function EligibilityProfiles({
  form,
  fields,
  removeEligibilityProfile
}) {
  return fields.map((profileItem, ind) => {
    const profileValue = fields.value[ind];
    return (
      <EligibilityProfile
        key={ind}
        profileValue={profileValue}
        profileItem={profileItem}
        index={ind}
        form={form}
        onAgeUpdated={(ageMin, ageMax) => {
          fields.update(ind, {
            ...profileValue,
            ageMin: ageMin,
            ageMax: ageMax
          });
        }}
        onIncomeTypeUpdated={initial => {
          fields.update(ind, {
            ...profileValue,
            percentAMI: null,
            percentFPL: null,
            incomeMaxima: [],
            ...initial
          });
        }}
        showRemove={fields.value.length > 1}
        removeEligibilityProfile={removeEligibilityProfile}
      />
    );
  });
}

EligibilityProfiles.propTypes = {
  form: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  removeEligibilityProfile: PropTypes.func.isRequired
};
