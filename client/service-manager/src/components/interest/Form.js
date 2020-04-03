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

import 'react-widgets/dist/css/react-widgets.css';
import './Form.css';

import { Field, Form as FinalForm } from 'react-final-form';

import DropdownList from 'react-widgets/lib/DropdownList';
import PropTypes from 'prop-types';
import React from 'react';
import { locales } from '../../Locales';
import { useMaterialIcons } from '../../hooks';

export default function Form(props) {
  const materialIcons = useMaterialIcons();

  let renderField = data => {
    let inputClassName = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      inputClassName += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (data.meta.touched && !data.meta.error) {
      inputClassName += ' is-valid';
    }

    let input = '';
    switch (data.input.type) {
      case 'select':
        data.input.containerClassName = inputClassName;
        input = (
          <DropdownList
            filter="contains"
            id={`interest_${data.input.name}`}
            aria-labelledby={`interest_${data.input.name}_label`}
            {...data.input}
            busy={!data.options}
            data={[null].concat(data.options || [])}
            itemComponent={item => {
              if (!item.value) {
                return <span className="rw-placeholder">&ensp;no icon</span>;
              } else {
                return (
                  <span>
                    <i className="material-icons align-middle">{item.value}</i>
                    &ensp;{item.value}
                  </span>
                );
              }
            }}
            placeholder={data.placeholder}
            valueComponent={item => (
              <span>
                <i className="material-icons align-middle">{item.item}</i>
                &ensp;{item.item}
              </span>
            )}
          />
        );
        break;
      default:
        data.input.className = inputClassName;
        input = (
          <input
            {...data.input}
            type={data.type}
            step={data.step}
            required={data.required}
            placeholder={data.placeholder}
            id={`interest_${data.input.name}`}
          />
        );
    }
    return (
      <div className={`form-group`}>
        <label
          id={`interest_${data.input.name}_label`}
          htmlFor={`interest_${data.input.name}`}
          className="form-control-label"
        >
          {data.label ? data.label : data.input.name}
        </label>
        {input}
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
              label={'name (' + l.language + ')'}
              type="text"
              placeholder={'The interest name in ' + l.language + '.'}
              required={true}
            />
          ))}
          <Field
            render={renderField}
            name="materialIcon"
            type="select"
            placeholder={materialIcons ? 'Select' : 'loading icons...'}
            options={materialIcons}
          />
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
