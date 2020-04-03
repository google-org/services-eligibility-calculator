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

import React, { useCallback, useEffect, useState } from 'react';
import { base64URLDecode, base64URLEncode } from '../../common/base64URL';
import { defaultLocale, locales } from '../../Locales';

import { BASEPATH } from '../../common/config';
import LanguageForms from './form/LanguageForms';
import PropTypes from 'prop-types';
import { ToastContext } from '../../App';
import cleanValues from './ServiceCleaner';
import { fetch } from '../../common/dataAccess';
import { getTranslationUpdateRequests } from '../../translationRequests';
import { useServiceTranslations } from '../../hooks';

export default function Create(props) {
  const handle404 = useCallback(
    () => props.history.replace(BASEPATH + 'servicedrafts/create/'),
    [props.history]
  );
  const entityUrl =
    props.match.params.id && base64URLDecode(props.match.params.id);
  const serviceValues = useServiceTranslations(
    entityUrl,
    handle404,
    /* disableTranslationFallback */ true
  );
  const [initialValues, setInitialValues] = useState({});
  const serviceHistory =
    props.location.state && props.location.state.serviceHistory;

  // When creating from history, set serviceUrl to the service ID not the service history ID
  const serviceUrl =
    (initialValues[defaultLocale] && initialValues[defaultLocale].service) ||
    entityUrl;

  useEffect(() => {
    const valueMap = {};
    serviceValues &&
      Object.keys(serviceValues).forEach(locale => {
        const service = serviceValues[locale];
        valueMap[locale] = {
          ...service,
          '@id': undefined,
          '@type': undefined,
          '@context': undefined,
          category: undefined,
          draft: undefined,
          interests: (service && service.interests) || [],
          eligibilityProfiles: (service && service.eligibilityProfiles) || [
            { incomeMaxima: [] }
          ]
        };
      });
    setInitialValues(valueMap);
  }, [serviceValues]);

  const { setToastMessage } = React.useContext(ToastContext);

  const createServiceDraft = (values, currentLocale) => {
    let defaultLocaleValues;
    // Post the service in the default locale
    fetch('service_drafts?locale=' + defaultLocale, {
      method: 'POST',
      body: JSON.stringify({
        ...cleanValues(values[defaultLocale]),
        service: serviceUrl
      })
    })
      .then(response => response.json())
      .then(json => {
        defaultLocaleValues = json;
        // Update defaultLocale values with IDs from the backend
        values[defaultLocale] = defaultLocaleValues;
        // Put (update) the service for all other locales
        return Promise.all(
          getTranslationUpdateRequests(defaultLocaleValues['@id'], values)
        );
      })
      .then(_ => {
        props.history.push({
          pathname: `${BASEPATH}servicedrafts/show/${base64URLEncode(
            defaultLocaleValues['@id']
          )}`,
          state: { locale: currentLocale }
        });
        setToastMessage(defaultLocaleValues.name + ' saved as draft');
      })
      .catch(errors => {
        window.alert('Failed to add service draft.\n' + errors);
      });
  };

  const isNewService = !entityUrl;
  const service = !isNewService && initialValues[defaultLocale];
  const title = service ? service.name : 'New service';

  return (
    <>
      {((service && service.name) || !serviceUrl) && (
        <LanguageForms
          title={title}
          helmetTitle={'New Draft: ' + title}
          serviceUrl={serviceUrl}
          locales={locales}
          locale={props.location.state && props.location.state.locale}
          initialValues={initialValues}
          serviceHistory={serviceHistory}
          onSubmit={createServiceDraft}
          onCancel={() =>
            props.history.push(
              (isNewService && BASEPATH + 'services/') ||
                `${BASEPATH}services/show/${base64URLEncode(serviceUrl)}`
            )
          }
        />
      )}
    </>
  );
}

Create.propTypes = {
  initialValues: PropTypes.object,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
