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

import FormSection, { Field } from './FormSection';

import HtmlEditor from './HtmlEditor';
import { OnChange } from 'react-final-form-listeners';
import PropTypes from 'prop-types';
import React from 'react';
import TextBox from './TextBox';
import { useTranslation } from 'react-i18next';

/**
 * Renders the "Overview" section of the form.
 */
export default function OverviewSection(props) {
  const { t } = useTranslation();

  return (
    <FormSection title={t('serviceDetails.overviewCard.overview')}>
      <Field
        component={TextBox}
        label={t('serviceDetails.overviewCard.name')}
        formatOnBlur
        format={value => value && value.trim()}
        name="name"
        placeholder="Enter service name"
        required={true}
      />
      <OnChange name="name">{value => props.onNameChange(value)}</OnChange>
      <Field
        component={HtmlEditor}
        label={t('serviceDetails.overviewCard.description')}
        name="description"
        placeholder="Provides residents with an initial understanding of the offering"
      />
    </FormSection>
  );
}

OverviewSection.propTypes = {
  onNameChange: PropTypes.func.isRequired
};
