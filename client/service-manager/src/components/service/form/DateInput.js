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

/**
 * A date selection input box.
 */
export default function DateInput(props) {
  return (
    <input
      type="date"
      id={`service_${props.input.name}`}
      className={
        !props.input.value ? 'form-control placeholder' : 'form-control'
      }
      disabled={props.disabled}
      {...props.input}
      value={props.input.value.split('T')[0]}
    />
  );
}

DateInput.propTypes = {
  input: PropTypes.object.isRequired,
  disabled: PropTypes.bool
};
