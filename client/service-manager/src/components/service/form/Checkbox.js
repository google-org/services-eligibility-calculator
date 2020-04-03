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

import Label from './Label';
import PropTypes from 'prop-types';
import React from 'react';

const CheckboxItem = props => {
  return (
    <div className="col-6 col-lg-4 col-xl-3">
      <label className="checkbox-container" htmlFor={`service_${props.name}`}>
        <input type="checkbox" id={`service_${props.name}`} {...props} />
        <span className="checkbox"></span>
        {props.label}
      </label>
    </div>
  );
};

/**
 * A group of checkboxes.
 */
export function CheckboxGroup(props) {
  let fieldMap = {}; // Map from field ID to index
  props.fields.value &&
    props.fields.value.forEach((field, ind) => {
      fieldMap[field['@id']] = ind;
    });
  const toggle = (event, option) => {
    if (event.target.checked) {
      props.fields.push(option);
    } else {
      props.fields.remove(fieldMap[option['@id']]);
    }
  };
  const invalid = !!props.meta.error;
  return (
    <>
      <Label {...props} invalid={invalid} />
      <div className="col-12 col-md-9">
        <div className="row">
          {props.options.map(option => {
            return (
              <CheckboxItem
                key={option['@id']}
                onClick={event => toggle(event, option)}
                checked={option['@id'] in fieldMap}
                name={option.name}
                groupname={props.fields.name}
                label={option.name}
                readOnly={true}
                disabled={props.disabled}
              />
            );
          })}
          {invalid && (
            <div className="invalid-feedback">{props.meta.error}</div>
          )}
        </div>
      </div>
    </>
  );
}

CheckboxGroup.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string
};

/**
 * A single checkbox.
 */
export default function Checkbox(props) {
  return <CheckboxItem {...props} {...props.input} />;
}

Checkbox.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string
};
