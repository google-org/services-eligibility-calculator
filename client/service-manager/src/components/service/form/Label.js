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

import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A display label in the form.
 */
export default function Label(props) {
  const { t } = useTranslation();

  return (
    <div className={'col-12 col-md-3'}>
      {props.label && (
        <label
          htmlFor={props.for && `service_${props.for}`}
          className={'col-form-label' + (props.invalid ? ' is-invalid' : '')}
        >
          {props.label}
          {props.required && <span> {t('serviceDetails.fieldRequired')}</span>}:
        </label>
      )}
    </div>
  );
}

Label.propTypes = {
  label: PropTypes.string,
  for: PropTypes.string,
  invalid: PropTypes.bool,
  required: PropTypes.bool
};
