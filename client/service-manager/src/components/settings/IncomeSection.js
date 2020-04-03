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

import React, { useContext, useState } from 'react';

import { AuthContext } from '../../App.js';
import Card from '../../common/components/service/Card.js';
import { FieldArray } from 'react-final-form-arrays';
import { Form as FinalForm } from 'react-final-form';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import arrayMutators from 'final-form-arrays';
import { hasRole } from '../../common/utils/index.js';
import { useTranslation } from 'react-i18next';

const NumberInput = props => {
  const { t } = useTranslation();

  return (
    <>
      <label htmlFor={`service_${props.name}`}>
        {props.label}
        {props.required && <span> {t('serviceDetails.fieldRequired')}</span>}
      </label>
      <input
        className="form-control ml-3 mb-2 p-1 d-inline"
        style={{ width: '100px' }}
        type="number"
        {...props.input}
        {...props}
        id={`service_${props.name}`}
      />
    </>
  );
};

export default function IncomeSection({
  helpText,
  initialValues,
  title,
  onSave
}) {
  const [editMode, setEditMode] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const isAdmin = hasRole(loggedInUser, 'ROLE_ADMIN');

  return (
    <FinalForm
      onSubmit={async values => {
        let saveSuccessful = await onSave(values);
        if (saveSuccessful) {
          setEditMode(false);
        }
      }}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit}>
          <Card
            header={
              <div className="d-flex justify-content-between">
                <div>{title}</div>
                <div>
                  {isAdmin &&
                    (editMode ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-blue-text"
                          onClick={() => {
                            form.reset();
                            setEditMode(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn btn-primary ml-3"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setEditMode(true)}
                      >
                        Edit
                      </button>
                    ))}
                </div>
              </div>
            }
          >
            <p>
              <i>{helpText}</i>
            </p>
            <FieldArray name="income">
              {({ fields }) => (
                <div className="d-flex flex-wrap">
                  {fields.map((name, index) => (
                    <div style={{ flex: '50%' }} key={name}>
                      {!editMode && (
                        <span className="text-nowrap mr-3">
                          Household of {index + 1}
                        </span>
                      )}
                      <NumberFormat
                        displayType={editMode ? 'input' : 'text'}
                        maxLength="10"
                        customInput={NumberInput}
                        required
                        thousandSeparator={true}
                        prefix={'$'}
                        label={
                          <span className="text-nowrap">
                            Household of {index + 1}
                          </span>
                        }
                        onValueChange={({ value }) => {
                          fields.update(index, parseInt(value));
                        }}
                        placeholder={'$0'}
                        value={fields.value[index]}
                        isAllowed={values => values.floatValue >= 0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>
          </Card>
        </form>
      )}
    />
  );
}

IncomeSection.propTypes = {
  helpText: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
};
