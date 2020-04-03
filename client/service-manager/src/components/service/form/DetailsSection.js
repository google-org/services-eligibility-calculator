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

import Checkbox, { CheckboxGroup } from './Checkbox';
import FormSection, { Field, FieldArray } from './FormSection';

import DateInput from './DateInput';
import DropDownSelection from './DropDownSelection';
import HtmlEditor from './HtmlEditor';
import Label from './Label';
import { OnChange } from 'react-final-form-listeners';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ApplicationWindow = ({ name, disabled }) => (
  <>
    <Field component={DateInput} name={name} disabled={disabled} />
    <Field name={name}>
      {({ input: { onChange } }) => (
        <OnChange name="alwaysAcceptApplications">
          {value => value && onChange(null)}
        </OnChange>
      )}
    </Field>
  </>
);

/**
 * Renders the "Details" section of the form (or "What is this service?").
 */
export default function DetailsSection({ departments, interests, values }) {
  const { t } = useTranslation();
  return (
    <FormSection title={t('serviceDetails.detailsCard.whatIsTheService')}>
      <Field
        component={HtmlEditor}
        label={t('serviceDetails.detailsCard.details')}
        name="details"
        placeholder="Additional details about this service and its application process"
      />
      <Field
        component={DropDownSelection}
        label={t('serviceDetails.detailsCard.department')}
        name="department"
        placeholder={departments ? 'Select' : 'loading departments...'}
        options={departments}
      />
      <div className={`form-group row`}>
        <Label
          label={t('serviceDetails.detailsCard.applicationWindow')}
          for="applicationWindowStart"
        />
        <div className="col-12 col-md-9">
          <div className="row">
            <div className="col-12 col-sm-5 col-xl-4">
              <ApplicationWindow
                name="applicationWindowStart"
                disabled={values.alwaysAcceptApplications}
              />
            </div>
            <div className="col-12 col-sm-2 text-sm-center col-xl-1">
              <label
                htmlFor="service_applicationWindowEnd"
                className="col-form-label "
              >
                {t('serviceDetails.detailsCard.to')}
              </label>
            </div>

            <div className="col-12 col-sm-5 col-xl-4">
              <ApplicationWindow
                name="applicationWindowEnd"
                disabled={values.alwaysAcceptApplications}
              />
            </div>

            <Field
              component={Checkbox}
              type="checkbox"
              label={t(
                'serviceDetails.detailsCard.alwaysAcceptingApplications'
              )}
              name="alwaysAcceptApplications"
            />
          </div>
        </div>
      </div>
      {interests && (
        <div className="form group row">
          <FieldArray
            component={CheckboxGroup}
            name="interests"
            label={t('serviceDetails.detailsCard.relatesTo')}
            options={interests}
          />
        </div>
      )}
    </FormSection>
  );
}

DetailsSection.propTypes = {
  values: PropTypes.object.isRequired,
  departments: PropTypes.array,
  interests: PropTypes.array
};
