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

import React, { useEffect, useState } from 'react';

import { ConfirmationPrompt } from '../../../common/utils';
import Form from './Form';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { defaultLocale } from '../../../Locales';
import omit from 'lodash/omit';
import { translatableFieldsArray } from '../ServiceCleaner';
import { useTranslation } from 'react-i18next';

export const LanguageFormsContext = React.createContext();

export default function LanguageForms(props) {
  const initialValues = props.initialValues;
  const serviceId =
    props.serviceUrl &&
    props.serviceUrl.substring(props.serviceUrl.lastIndexOf('/') + 1);

  const [currentLocale, setLocale] = useState(props.locale || defaultLocale);
  // formValues stores current values for each language
  const [formValues, setFormValues] = useState(initialValues);
  // formDirty stores whether the form for each language is dirty
  const notDirty = {};
  props.locales.forEach(locale => (notDirty[locale.locale] = false));
  const [formDirty, setFormDirty] = useState(notDirty);
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(currentLocale);
  }, [currentLocale, i18n]);

  const [errors, setErrors] = useState(props.errors);
  for (let locale in errors) {
    if (errors[locale]) {
      setErrors(undefined);
      setLocale(locale);
      break;
    }
  }

  const addEligibilityProfile = () => {
    const newFormValues = Object.keys(formValues).reduce(
      (accumulator, currentKey) => {
        const currentValue = formValues[currentKey];
        accumulator[currentKey] = {
          ...currentValue,
          eligibilityProfiles: [
            ...currentValue.eligibilityProfiles,
            {
              incomeMaxima: []
            }
          ]
        };
        return accumulator;
      },
      {}
    );
    setFormValues(newFormValues);
  };

  const removeEligibilityProfile = index => {
    const newFormValues = Object.keys(formValues).reduce(
      (accumulator, currentKey) => {
        const currentValue = formValues[currentKey];
        const eligibilityProfiles = [...currentValue.eligibilityProfiles];
        eligibilityProfiles.splice(index, 1);
        accumulator[currentKey] = {
          ...currentValue,
          eligibilityProfiles
        };
        return accumulator;
      },
      {}
    );
    setFormValues(newFormValues);
  };

  const handleLocaleChange = (locale, values) => {
    setFormValues(formValues => ({ ...formValues, [currentLocale]: values }));
    setLocale(locale);
  };

  const handleSubmit = values => {
    const valuesToSubmit = { ...formValues, [currentLocale]: values };
    setFormDirty(notDirty);

    props.locales.forEach(language => {
      const locale = language.locale;
      if (!valuesToSubmit[locale]) {
        valuesToSubmit[locale] = initialValues[locale];
      }
      if (!valuesToSubmit[locale].name) {
        valuesToSubmit[locale].name = valuesToSubmit[defaultLocale].name;
      }
    });
    props.onSubmit(valuesToSubmit, currentLocale);
  };

  const defaultNonTranslatableFormValues =
    formValues &&
    formValues[defaultLocale] &&
    omit(formValues[defaultLocale], [...translatableFieldsArray]);

  const defaultNonTranslatableEligibilityProfiles =
    formValues &&
    formValues[defaultLocale] &&
    formValues[defaultLocale].eligibilityProfiles &&
    formValues[defaultLocale].eligibilityProfiles.map(eligibilityProfile =>
      omit(eligibilityProfile, [...translatableFieldsArray])
    );

  const draft =
    formValues && formValues[currentLocale]
      ? formValues && {
          ...formValues[currentLocale],
          ...defaultNonTranslatableFormValues,
          eligibilityProfiles: defaultNonTranslatableEligibilityProfiles.map(
            (defaultEligbilityProfile, index) => ({
              ...formValues[currentLocale].eligibilityProfiles[index],
              ...defaultEligbilityProfile
            })
          )
        }
      : initialValues && initialValues[currentLocale];

  return (
    <LanguageFormsContext.Provider
      value={{
        locale: currentLocale,
        defaultLocaleValues: formValues && formValues[defaultLocale]
      }}
    >
      <ConfirmationPrompt
        when={Object.values(formDirty).some(isDirty => isDirty)}
        title="Navigate away before saving?"
        description="If you do, your unsaved changes will be lost"
        cancelText="Stay on this page"
        confirmationText="Leave this page"
      />
      {draft && (
        <>
          <Helmet>
            <title>{props.helmetTitle}</title>
          </Helmet>
          <Form
            title={props.title}
            initialValues={draft}
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            serviceId={serviceId}
            serviceHistory={props.serviceHistory}
            onDirtyUpdate={dirty =>
              setFormDirty({ ...formDirty, [currentLocale]: dirty })
            }
            locale={currentLocale}
            locales={props.locales}
            onLocaleChange={handleLocaleChange}
            addEligibilityProfile={addEligibilityProfile}
            removeEligibilityProfile={removeEligibilityProfile}
          />
        </>
      )}
    </LanguageFormsContext.Provider>
  );
}

LanguageForms.propTypes = {
  helmetTitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  locales: PropTypes.array.isRequired,
  locale: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  serviceUrl: PropTypes.string,
  serviceHistory: PropTypes.array,
  errors: PropTypes.object
};
