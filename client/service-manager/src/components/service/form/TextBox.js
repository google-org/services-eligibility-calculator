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
import TextareaAutosize from 'react-textarea-autosize';

export function SimpleTextBox(props) {
  const invalid = !!props.meta.error;
  return (
    <div className={props.className || 'col-12 col-md-9'}>
      <TextareaAutosize
        {...props.input}
        className={'form-control' + (invalid ? ' is-invalid' : '')}
        id={`service_${props.input.name}`}
        placeholder={props.placeholder}
        aria-label={props.label || props.placeholder}
        onKeyUp={event => props.input.onChange(event.target.value)}
      />
      {invalid && <div className="invalid-feedback">{props.meta.error}</div>}
    </div>
  );
}

SimpleTextBox.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  required: PropTypes.bool
};

export default function TextBox(props) {
  const invalid = !!props.meta.error;
  return (
    <>
      <div className={`form-group row`} style={props.style}>
        <Label {...props} for={props.input.name} invalid={invalid} />
        <SimpleTextBox {...props} />
        {props.children}
      </div>
    </>
  );
}

TextBox.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  required: PropTypes.bool
};
