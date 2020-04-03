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

import { ExternalLink } from '../common/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <>
      <div className="app-footer">
        <ExternalLink
          action="CityWebsite"
          url={t('serviceList.linkToCityWebsite')}
        >
          {t('serviceList.linkToCityWebsiteText')}
        </ExternalLink>
        •
        <ExternalLink
          action="Feedback"
          url={t('serviceList.shareFeedbackLink')}
        >
          {t('serviceList.shareFeedback')}{' '}
          <i className="material-icons align-middle" aria-hidden="true">
            open_in_new
          </i>
        </ExternalLink>
      </div>
    </>
  );
}
