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

export default function DropDownSelection(props) {
  return (
    <div className={`form-group row`}>
      <Label {...props} for={props.input.name} />
      <div className="col-12 col-md-9">
        <select
          {...props.input}
          id={`service_${props.input.name}`}
          className={
            !props.input.value ? 'form-control placeholder' : 'form-control'
          }
          disabled={props.disabled}
        >
          <option key="placeholder" defaultValue disabled hidden value="">
            {props.placeholder}
          </option>
          {props.options &&
            props.options.map(option => (
              <option key={option['@id']} value={option['@id']}>
                {option.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

DropDownSelection.propTypes = {
  input: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.array,
  label: PropTypes.string
};
