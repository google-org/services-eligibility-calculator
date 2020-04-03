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

import { Field, Form as FinalForm } from 'react-final-form';

import PropTypes from 'prop-types';
import React from 'react';
import { locales } from '../../Locales';

export default function Form(props) {
  let renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`department_${data.input.name}`}
          className="form-control-label"
        >
          {data.displayName}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`department_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  return (
    <FinalForm
      onSubmit={props.onSubmit}
      initialValues={props.initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {locales.map(l => (
            <Field
              key={l.locale}
              render={renderField}
              name={'name-' + l.locale}
              displayName={'name (' + l.language + ')'}
              type="text"
              placeholder={'The department name in ' + l.language + '.'}
              required={true}
            />
          ))}
          <hr />
          <div className="float-right">
            {props.onCancel && (
              <button onClick={props.onCancel} className="btn btn-blue-text">
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-blue-text">
              Save
            </button>
          </div>
        </form>
      )}
    />
  );
}

Form.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};
