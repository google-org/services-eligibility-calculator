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

import React, { useCallback, useState } from 'react';
import { base64URLDecode, base64URLEncode } from '../../common/base64URL';
import { defaultLocale, locales } from '../../Locales';

import ActionModal from '../ActionModal';
import { BASEPATH } from '../../common/config';
import LanguageForms from './form/LanguageForms';
import PropTypes from 'prop-types';
import { ToastContext } from '../../App';
import cleanValues from './ServiceCleaner';
import { fetch } from '../../common/dataAccess';
import { getTranslationUpdateRequests } from '../../translationRequests';
import { useServiceTranslations } from '../../hooks';

export default function Update(props) {
  const handle404 = useCallback(
    () => props.history.replace(BASEPATH + 'services/'),
    [props.history]
  );
  const initialValues = useServiceTranslations(
    base64URLDecode(props.match.params.id),
    handle404,
    /* disableTranslationFallback */ true
  );
  const serviceUrl =
    initialValues &&
    initialValues[defaultLocale] &&
    initialValues[defaultLocale].service &&
    initialValues[defaultLocale].service['@id'];
  const fromPublished =
    props.location.state && props.location.state.fromPublished;
  const errors = props.location.state && props.location.state.errors;

  const { setToastMessage } = React.useContext(ToastContext);
  const [
    showExistingDraftConfirmation,
    setShowExistingDraftConfirmation
  ] = useState(fromPublished);

  const updateDraft = (values, currentLocale) => {
    let defaultLocaleValues = cleanValues(values[defaultLocale]);
    // Put the changes to the service in the default locale
    fetch(defaultLocaleValues['@id'] + '?locale=' + defaultLocale, {
      method: 'PUT',
      body: JSON.stringify(defaultLocaleValues)
    })
      .then(response => response.json())
      .then(json => {
        // Update defaultLocale values with IDs from the backend
        defaultLocaleValues = json;
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
        window.alert(
          'Failed to update:\n\t' + defaultLocaleValues.name + '\n\n' + errors
        );
      });
  };

  const defaultLocaleDraft = initialValues[defaultLocale];

  return (
    <>
      {defaultLocaleDraft && showExistingDraftConfirmation && (
        <ActionModal
          title="Draft already exists"
          actionText="Continue"
          onAction={() => {
            setShowExistingDraftConfirmation(false);
          }}
        >
          <div className="body">
            {'A draft of ' +
              defaultLocaleDraft.name +
              ' already exists, and was last edited by ' +
              defaultLocaleDraft.lastModifiedByDisplayName +
              '. Continue editing the draft here.'}
          </div>
        </ActionModal>
      )}
      {defaultLocaleDraft && defaultLocaleDraft.name && (
        <LanguageForms
          serviceUrl={serviceUrl}
          locales={locales}
          locale={props.location.state && props.location.state.locale}
          initialValues={initialValues}
          serviceHistory={
            defaultLocaleDraft.service && defaultLocaleDraft.service.history
          }
          errors={errors}
          title={defaultLocaleDraft.name}
          helmetTitle={'Update Draft: ' + defaultLocaleDraft.name}
          onSubmit={updateDraft}
          onCancel={() =>
            props.history.push(
              fromPublished
                ? `${BASEPATH}services/show/${base64URLEncode(serviceUrl)}`
                : `${BASEPATH}servicedrafts/show/${base64URLEncode(
                    defaultLocaleDraft['@id']
                  )}`
            )
          }
        />
      )}
    </>
  );
}

Update.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
