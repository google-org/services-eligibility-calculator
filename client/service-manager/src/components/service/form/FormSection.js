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

import React, { useContext } from 'react';

import Card from '../../../common/components/service/Card';
import { LanguageFormsContext } from './LanguageForms';
import PropTypes from 'prop-types';
import { Field as ReactField } from 'react-final-form';
import { FieldArray as ReactFieldArray } from 'react-final-form-arrays';
import { defaultLocale } from '../../../Locales';
import { fieldIsTranslatable } from '../ServiceCleaner';
import { getIn } from 'final-form';
import { useTranslation } from 'react-i18next';

/**
 * Displays a logical section of the form with shared information
 * at the top of the section.
 */
export default function FormSection(props) {
  const { t } = useTranslation();

  return (
    <Card title={props.title}>
      <p>
        <i className="instructions">{t('serviceDetails.blankFields')}</i>
      </p>
      {props.children}
    </Card>
  );
}

FormSection.propTypes = {
  title: PropTypes.string.isRequired
};

export function Field(props) {
  const { locale, defaultLocaleValues } = useContext(LanguageFormsContext);
  const translatable = fieldIsTranslatable(props.name);

  return (
    <ReactField
      {...props}
      locale={locale}
      disabled={props.disabled || (locale !== defaultLocale && !translatable)}
      placeholder={
        locale !== defaultLocale && translatable
          ? getIn(defaultLocaleValues, props.name)
          : props.placeholder
      }
    />
  );
}

export function FieldArray(props) {
  const { locale } = useContext(LanguageFormsContext);

  return (
    <ReactFieldArray
      {...props}
      locale={locale}
      disabled={
        props.disabled ||
        (locale !== defaultLocale && !fieldIsTranslatable(props.name))
      }
    />
  );
}
