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

import FormSection, { Field, FieldArray } from './FormSection';
import TextBox, { SimpleTextBox } from './TextBox';

import HtmlEditor from './HtmlEditor';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const UrlFields = ({ fields, placeholder }) => {
  const { t } = useTranslation();

  return fields.map((field, ind) => {
    return (
      <Field
        component={TextBox}
        key={ind}
        formatOnBlur
        format={value => (value ? value.trim() : value)}
        label={
          ind === 0 ? t('serviceDetails.applicationCard.online') : undefined
        }
        placeholder={placeholder}
        name={field}
        style={ind === fields.length - 1 ? { marginBottom: '2px' } : undefined}
      />
    );
  });
};

/**
 * Renders the "Application" section of the form.
 */
export default function ApplicationSection({ form, values }) {
  const { t } = useTranslation();
  const addApplicationWebAddress = form => {
    form.mutators.push('applicationWebAddresses', '');
  };

  return (
    <FormSection title={t('serviceDetails.applicationCard.howDoIApply')}>
      <Field
        component={TextBox}
        label={t('serviceDetails.applicationCard.learnMore')}
        formatOnBlur
        format={value => value && value.trim()}
        name="applicationOnline"
        placeholder={t('serviceDetails.applicationCard.placeholders.learnMore')}
        required={true}
      />
      <hr />
      <div className="instructions">
        {t('serviceDetails.applicationCard.firstYoullNeed')}:
      </div>
      <Field
        component={HtmlEditor}
        label={t('serviceDetails.applicationCard.documentsNeeded')}
        name="applicationDocuments"
        placeholder={t(
          'serviceDetails.applicationCard.placeholders.documentsNeeded'
        )}
      />
      <hr />
      <div className="instructions">
        {t('serviceDetails.applicationCard.whenReadyApply')}:
      </div>
      <Field
        component={TextBox}
        label={t('serviceDetails.applicationCard.call')}
        formatOnBlur
        format={value => value && value.trim()}
        className="col-6 col-md-4"
        name="applicationPhone"
        placeholder={t(
          'serviceDetails.applicationCard.placeholders.phoneNumber'
        )}
      >
        <Field
          component={SimpleTextBox}
          className="col-6 col-md-5"
          formatOnBlur
          format={value => value && value.trim()}
          name="applicationPhoneOther"
          placeholder={t(
            'serviceDetails.applicationCard.placeholders.phoneOther'
          )}
        />
      </Field>
      <Field
        component={TextBox}
        label={t('serviceDetails.applicationCard.email')}
        formatOnBlur
        format={value => value && value.trim()}
        name="contactEmail"
        placeholder={t('serviceDetails.applicationCard.placeholders.email')}
      />
      {(!values.applicationWebAddresses ||
        values.applicationWebAddresses.length === 0) &&
        addApplicationWebAddress(form)}
      <FieldArray
        component={UrlFields}
        name="applicationWebAddresses"
        placeholder={t(
          'serviceDetails.applicationCard.placeholders.webAddress'
        )}
      />
      <div className="row">
        <div className="col-12 col-md-3" />
        <div className="col-12 col-md-9">
          <button
            className="btn btn-blue-text"
            onClick={e => {
              e.preventDefault();
              addApplicationWebAddress(form);
            }}
          >
            {t('serviceDetails.applicationCard.addWebAddressButton')}
          </button>
        </div>
      </div>
      <Field
        component={TextBox}
        label={t('serviceDetails.applicationCard.inPerson')}
        formatOnBlur
        format={value => value && value.trim()}
        name="applicationAddress"
        placeholder={t('serviceDetails.applicationCard.placeholders.address')}
      />
      <Field
        component={TextBox}
        formatOnBlur
        format={value => value && value.trim()}
        name="applicationHours"
        placeholder={t(
          'serviceDetails.applicationCard.placeholders.applicationHours'
        )}
      />
    </FormSection>
  );
}

ApplicationSection.propTypes = {
  form: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired
};
