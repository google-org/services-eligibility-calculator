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

import './Form.css';

import { AuthContext, ToastContext } from '../../../App';
import { Col, Row } from 'react-bootstrap';
import { FocusOnFirstError, getAllOwners } from '../../../common/utils';
import React, { useContext, useState } from 'react';
import {
  useTranslatedDepartments,
  useTranslatedInterests
} from '../../../hooks';
import {
  validateDefaultLocaleService,
  validateTranslatedService
} from '../ServiceValidators';

import AnalyticsCard from '../AnalyticsCard';
import ApplicationSection from './ApplicationSection';
import { BASEPATH } from '../../../common/config';
import DetailsSection from './DetailsSection';
import EligibilitySection from './EligibilitySection';
import { Form as FinalForm } from 'react-final-form';
import { FormSpy } from 'react-final-form';
import HistoryCard from '../HistoryCard';
import LanguageButtons from '../LanguageButtons';
import { LanguageFormsContext } from './LanguageForms';
import OverviewSection from './OverviewSection';
import PropTypes from 'prop-types';
import { SERVICE_TYPE_DRAFT } from '../../../common/utils/serviceTypes';
import ServiceOwnerCard from '../ServiceOwnerCard';
import StickyHeader from '../StickyHeader';
import arrayMutators from 'final-form-arrays';
import { defaultLocale } from '../../../Locales';

/** The service creation/edit form */
export default function Form(props) {
  const { departments } = useTranslatedDepartments();
  const { interests } = useTranslatedInterests();
  const owners = getAllOwners(props.initialValues);
  const { loggedInUser } = React.useContext(AuthContext);
  if (owners.length === 0 && loggedInUser) {
    owners.push(loggedInUser.username.toLowerCase());
  }
  const { setToastMessage } = React.useContext(ToastContext);
  let formElement = React.createRef();
  const { defaultLocaleValues } = useContext(LanguageFormsContext);

  const initialValues = {
    ...props.initialValues,
    department:
      (props.initialValues.department &&
        props.initialValues.department['@id']) ||
      props.initialValues.department,
    applicationWebAddresses:
      props.initialValues.applicationWebAddresses &&
      props.initialValues.applicationWebAddresses.length > 0
        ? props.initialValues.applicationWebAddresses
        : ['']
  };

  const [title, setTitle] = useState(props.title);

  const checkName = values => {
    if (!values.name || values.name.length === 0) {
      setToastMessage('A name is required');
      document.getElementById(`service_name`).focus();
      return false;
    }
    return true;
  };

  const handleLocaleChange = (newLocale, values, form) => {
    if (props.locale === defaultLocale && !checkName(values)) return;
    const dirty = form.getState().dirty;
    form.setConfig('keepDirtyOnReinitialize', false);
    form.reset();
    form.setConfig('keepDirtyOnReinitialize', true);
    props.onDirtyUpdate(dirty);
    props.onLocaleChange(newLocale, values);
  };

  const renderActionButtons = (values, valid) => {
    return (
      <div className="float-right">
        <button
          onClick={e => {
            e.preventDefault();
            props.onCancel();
          }}
          className="btn btn-blue-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={e => {
            if (props.locale === defaultLocale && !checkName(values)) return;
            if (!valid) {
              // Allow saving with errors.
              e.preventDefault();
              props.onSubmit(values);
            }
          }}
        >
          Save and preview
        </button>
      </div>
    );
  };

  const renderForm = ({ form, handleSubmit, values, valid }) => {
    if (valid) setToastMessage(undefined);
    return (
      <form
        ref={formElement}
        onSubmit={handleSubmit}
        name="serviceForm"
        className="service-form"
      >
        <FormSpy
          subscription={{ dirty: true }}
          onChange={state => props.onDirtyUpdate(state.dirty)}
        />
        <StickyHeader
          title={title}
          serviceType={SERVICE_TYPE_DRAFT}
          backLink={`${BASEPATH}services/`}
          actionButtons={renderActionButtons(values, valid)}
        />
        <LanguageButtons
          locales={props.locales}
          locale={props.locale}
          onLocaleChange={locale => handleLocaleChange(locale, values, form)}
        />
        <Row>
          <Col xs={12} lg={8} className="px-0 px-md-3">
            <OverviewSection
              onNameChange={name =>
                name
                  ? setTitle(name)
                  : defaultLocaleValues && setTitle(defaultLocaleValues.name)
              }
              locale={props.locale}
            />
            {departments && interests && (
              <DetailsSection
                departments={departments[props.locale]}
                interests={interests[props.locale]}
                values={values}
              />
            )}
            <EligibilitySection
              form={form}
              values={values}
              addEligibilityProfile={props.addEligibilityProfile}
              removeEligibilityProfile={props.removeEligibilityProfile}
            />
            <ApplicationSection form={form} values={values} />
          </Col>
          <Col xs={12} lg={4} className="px-0 px-md-3">
            <ServiceOwnerCard owners={owners} />
            <AnalyticsCard serviceId={props.serviceId} />
            <HistoryCard
              history={props.serviceHistory}
              serviceId={props.serviceId}
              serviceType={SERVICE_TYPE_DRAFT}
            />
          </Col>
        </Row>
        {departments && interests && <FocusOnFirstError></FocusOnFirstError>}
      </form>
    );
  };

  return (
    <FinalForm
      onSubmit={props.onSubmit}
      mutators={{
        ...arrayMutators
      }}
      keepDirtyOnReinitialize
      initialValues={initialValues}
      render={renderForm}
      validate={
        props.locale === defaultLocale
          ? validateDefaultLocaleService
          : validateTranslatedService
      }
    />
  );
}

Form.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDirtyUpdate: PropTypes.func.isRequired,
  onLocaleChange: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  locales: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.object.isRequired,
  serviceId: PropTypes.string,
  addEligibilityProfile: PropTypes.func.isRequired,
  removeEligibilityProfile: PropTypes.func.isRequired,
  serviceHistory: PropTypes.array
};
