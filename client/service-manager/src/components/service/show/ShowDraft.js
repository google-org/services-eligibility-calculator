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
import { base64URLDecode, base64URLEncode } from '../../../common/base64URL';

import ActionModal from '../../ActionModal';
import { BASEPATH } from '../../../common/config';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { SERVICE_TYPE_DRAFT } from '../../../common/utils/serviceTypes';
import Show from './Show';
import { ToastContext } from '../../../App';
import { canManageService } from '../../../common/utils';
import { defaultLocale } from '../../../Locales';
import { fetch } from '../../../common/dataAccess';
import { useServiceTranslations } from '../../../hooks';
import { validateServiceTranslations } from '../ServiceValidators';

/**
 * Displays information for a draft service.
 */
export default function ShowDraft({ location, history, match }) {
  const draftUrl = base64URLDecode(match.params.id);
  const handle404 = useCallback(() => history.replace(BASEPATH + 'services/'), [
    history
  ]);
  const translations = useServiceTranslations(draftUrl, handle404);
  const draft = translations[defaultLocale];
  // Retrieve serviceId for underlying service from draft.
  const parentServiceUrl = draft && draft.service && draft.service['@id'];
  const serviceId =
    parentServiceUrl &&
    parentServiceUrl.substring(parentServiceUrl.lastIndexOf('/') + 1);
  const serviceHistory = draft && draft.service && draft.service.history;
  const editLink = {
    pathname: `../edit/${base64URLEncode(draftUrl)}`
  };
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishErrors, setPublishErrors] = useState(undefined);
  const { setToastMessage } = React.useContext(ToastContext);

  const publishDraft = () => {
    fetch(draft['@id'] + '/publish', {
      method: 'PUT',
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(_ => {
        if (draft['@id']) {
          fetch(draft['@id'], { method: 'DELETE' }).then(_ =>
            history.push(`${BASEPATH}services/`)
          );
        } else {
          history.push(`${BASEPATH}services/`);
        }
        setToastMessage(draft.name + ' published');
      })
      .catch(error => {
        window.alert('Failed to publish draft.\n' + error);
      });
  };

  const handlePublish = () => {
    const errors = validateServiceTranslations(translations);

    if (errors) {
      setPublishErrors(errors);
      setToastMessage('Please fix all errors before publishing');
    } else {
      setShowPublishModal(true);
    }
  };

  if (publishErrors && draftUrl) {
    return <Redirect to={{ ...editLink, state: { errors: publishErrors } }} />;
  }

  return (
    <>
      {draft && (
        <Helmet>
          <title>Draft: {draft.name}</title>
        </Helmet>
      )}
      {showPublishModal && (
        <ActionModal
          title={'Publish ' + draft.name + '?'}
          analyticsLabel="Publish"
          cancelText="No, cancel"
          onCancel={() => setShowPublishModal(false)}
          actionText="Yes, publish"
          onAction={() => {
            setShowPublishModal(false);
            publishDraft();
          }}
        >
          <div className="body">
            <p>
              If you publish this service, residents will see it in the
              Eligibility Calculator.
            </p>
            <p className="font-weight-bold">
              Make sure you have translated any changes to this service.
            </p>
          </div>
        </ActionModal>
      )}
      {draft && (
        <Show
          {...{
            entityType: SERVICE_TYPE_DRAFT,
            fromSettings:
              location && location.state && location.state.fromSettings,
            locale: location && location.state && location.state.locale,
            translations,
            entityUrl: draftUrl,
            serviceId,
            history,
            serviceHistory,
            editLink,
            canManageService,
            onPublish: handlePublish
          }}
        />
      )}
    </>
  );
}

ShowDraft.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
