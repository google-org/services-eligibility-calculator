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

import { Field, FieldArray } from './FormSection';
import { INCOME_TYPE_AMI, INCOME_TYPE_CUSTOM } from './IncomeTypes';
import React, { useContext } from 'react';

import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../../App';
import { useTranslation } from 'react-i18next';

const NumberInput = props => {
  const { t } = useTranslation();

  return (
    <>
      <label htmlFor={`service_${props.name}`} className="col-6">
        {props.label}
        {props.required && <span> {t('serviceDetails.fieldRequired')}</span>}
      </label>
      <input
        className="form-control small-text"
        type="number"
        {...props.input}
        {...props}
        id={`service_${props.name}`}
      />
    </>
  );
};

const IncomeInputs = ({ fields, placeholderValues, disabled }) => {
  return placeholderValues.map((placeholderValue, ind) => {
    const value =
      fields.value && fields.value.length >= ind ? fields.value[ind] : null;
    return (
      <span key={ind} className="col-xl-6 col-12 income-inputs">
        <NumberFormat
          displayType={'input'}
          maxLength="10"
          customInput={NumberInput}
          thousandSeparator={true}
          prefix={'$'}
          label={<span className="text-nowrap">Household of {ind + 1}</span>}
          value={value}
          placeholder={'$' + placeholderValue}
          onValueChange={({ value }) => {
            fields.update(ind, value);
          }}
          isAllowed={values => values.floatValue >= 0}
          disabled={disabled}
          name={fields.name + '_' + ind}
        />
      </span>
    );
  });
};

const PercentInput = props => {
  return (
    <NumberFormat
      displayType={'input'}
      customInput={NumberInput}
      suffix={'%'}
      {...props}
      {...props.input}
      maxLength="10"
      onChange={event => props.input.onChange(event)}
      onValueChange={({ value }) => {
        props.input.onChange(value);
      }}
      placeholder={props.placeholder + '%'}
      isAllowed={values => values.floatValue >= 0 && values.floatValue < 1000}
    />
  );
};

export default function IncomeGrid({ incomeType, profileValue, profileItem }) {
  const { settings } = useContext(SettingsContext);

  if (incomeType === INCOME_TYPE_CUSTOM) {
    let defaultIncomeValues = Array(8).fill('0');
    return (
      <div className="income-block row">
        <FieldArray
          component={IncomeInputs}
          name={`${profileItem}.incomeMaxima`}
          placeholderValues={defaultIncomeValues}
        />
      </div>
    );
  } else {
    const typeName = incomeType === INCOME_TYPE_AMI ? 'AMI' : 'FPL';
    const fieldName = `percent${typeName}`;
    const placeholderValue = 0;
    const fieldValue = profileValue[fieldName]
      ? profileValue[fieldName]
      : placeholderValue;
    const incomeValues = settings
      ? incomeType === INCOME_TYPE_AMI
        ? settings.ami
        : settings.fpl
      : Array(8).fill('0');
    return (
      <div className="col-12 col-md-9 income-block">
        <Field
          component={PercentInput}
          name={`${profileItem}.percent${typeName}`}
          label={'Percent of ' + typeName}
          placeholder={placeholderValue}
          value={fieldValue}
          parse={value => parseInt(value)}
        />
        <div className="income-grid">
          <div className="row">
            {incomeValues.map((value, ind) => (
              <div className="col-md-6 col-12" key={ind}>
                <span className="text-nowrap mr-3">Household of {ind + 1}</span>
                <span
                  className={
                    fieldValue === placeholderValue ? 'placeholder' : undefined
                  }
                >
                  <NumberFormat
                    value={value * 0.01 * fieldValue}
                    displayType={'text'}
                    thousandSeparator={true}
                    maxLength="10"
                    prefix={'$'}
                    className="text-nowrap"
                    decimalScale={0}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

IncomeGrid.propTypes = {
  incomeType: PropTypes.string,
  profileValue: PropTypes.object,
  profileItem: PropTypes.string
};
