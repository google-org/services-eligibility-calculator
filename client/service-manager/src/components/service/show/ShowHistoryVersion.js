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

import React, { useCallback } from 'react';
import { base64URLDecode, base64URLEncode } from '../../../common/base64URL';
import { useService, useServiceTranslations } from '../../../hooks';

import { BASEPATH } from '../../../common/config';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { SERVICE_TYPE_HISTORY_VERSION } from '../../../common/utils/serviceTypes';
import Show from './Show';
import { canManageService } from '../../../common/utils';
import { defaultLocale } from '../../../Locales';

/**
 * Displays information for a version of a service.
 */
export default function ShowHistoryVersion({ history, match, location }) {
  const versionUrl = base64URLDecode(match.params.id);
  const handle404 = useCallback(() => history.replace(BASEPATH + 'services/'), [
    history
  ]);
  const translations = useServiceTranslations(versionUrl, handle404);
  const version = translations[defaultLocale];
  const serviceHistory = location.state && location.state.serviceHistory;
  const service = useService(version && version.service);
  const serviceId =
    version &&
    version.service &&
    version.service.substring(version.service.lastIndexOf('/') + 1);
  const editLink = (service &&
    (service.draft
      ? {
          pathname: `${BASEPATH}servicedrafts/edit/${base64URLEncode(
            service.draft['@id']
          )}`,
          state: { fromPublished: true }
        }
      : {
          pathname: `${BASEPATH}servicedrafts/create/${base64URLEncode(
            versionUrl
          )}`,
          state: { serviceHistory: service.history }
        })) || { pathname: '' };

  return (
    <>
      {version && (
        <Helmet>
          <title>History: {version.name}</title>
        </Helmet>
      )}
      {version && (
        <Show
          {...{
            entityType: SERVICE_TYPE_HISTORY_VERSION,
            fromSettings:
              location && location.state && location.state.fromSettings,
            translations,
            entityUrl: versionUrl,
            serviceHistory,
            editLink,
            serviceId,
            canManageService: (loggedInUser, _) =>
              canManageService(loggedInUser, service),
            history
          }}
        />
      )}
    </>
  );
}

ShowHistoryVersion.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
