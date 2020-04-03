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

import { Field } from './FormSection';
import Label from './Label';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import React from 'react';
import { useTranslation } from 'react-i18next';

const RadioButtonItem = props => {
  return (
    <div className="radio-button">
      <Radio
        {...props}
        color="default"
        className="form-check-input"
        id={`service_${props.name}_${props.label}`}
      />
      <label
        className="form-check-label"
        htmlFor={`service_${props.name}_${props.label}`}
      >
        {props.label}
      </label>
    </div>
  );
};

RadioButton.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};

export default function RadioButton(props) {
  return <RadioButtonItem {...props} {...props.input} />;
}

RadioButton.propTypes = {
  input: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string
};

export function YesNoRadio(props) {
  const parseBoolean = value => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  };

  const { t } = useTranslation();

  return (
    <>
      <div className={`form-group row`}>
        <Label {...props} for={props.name} />
        <div
          className="col-12 col-md-9"
          role="radiogroup"
          aria-label={props.label}
        >
          <Field
            component={RadioButton}
            type="radio"
            name={props.name}
            value={true}
            label={t('serviceDetails.eligibilityCard.yes')}
            parse={parseBoolean}
          />
          <Field
            component={RadioButton}
            type="radio"
            name={props.name}
            value={false}
            label={t('serviceDetails.eligibilityCard.no')}
            parse={parseBoolean}
          />
        </div>
      </div>
    </>
  );
}

YesNoRadio.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string
};
