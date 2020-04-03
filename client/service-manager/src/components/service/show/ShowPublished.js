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
import {
  SERVICE_TYPE_ARCHIVED,
  SERVICE_TYPE_PUBLISHED
} from '../../../common/utils/serviceTypes';
import { base64URLDecode, base64URLEncode } from '../../../common/base64URL';

import { BASEPATH } from '../../../common/config';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Show from './Show';
import { canManageService } from '../../../common/utils';
import { defaultLocale } from '../../../Locales';
import { useServiceTranslations } from '../../../hooks';

/**
 * Displays information for a published service.
 */
export default function ShowPublished({ location, history, match }) {
  const serviceUrl = base64URLDecode(match.params.id);
  const handle404 = useCallback(() => history.replace(BASEPATH + 'services/'), [
    history
  ]);
  const translations = useServiceTranslations(serviceUrl, handle404);
  const service = translations[defaultLocale];
  const serviceId = serviceUrl.substring(serviceUrl.lastIndexOf('/') + 1);
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
            serviceUrl
          )}`,
          state: { serviceHistory: service.history }
        })) || { pathname: '' };

  return (
    <>
      {service && (
        <Helmet>
          <title>{service.name}</title>
        </Helmet>
      )}
      {service && (
        <Show
          {...{
            entityType:
              service && service.archivedDateTime
                ? SERVICE_TYPE_ARCHIVED
                : SERVICE_TYPE_PUBLISHED,
            fromSettings:
              location && location.state && location.state.fromSettings,
            translations,
            entityUrl: serviceUrl,
            serviceId,
            editLink,
            canManageService,
            history,
            serviceHistory: service && service.history
          }}
        />
      )}
    </>
  );
}

ShowPublished.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};
