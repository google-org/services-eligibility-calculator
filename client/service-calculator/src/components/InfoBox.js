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
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function InfoBox({ className }) {
  const { t } = useTranslation();

  return (
    <>
      <div className={`info-box ${className || ''}`}>
        <div className="circle">
          <i className="material-icons" aria-hidden="true">
            lightbulb_outline
          </i>
        </div>
        <div className="info-box-content">
          <div aria-hidden="true">{t('serviceList.infoPreText')}</div>
          <ExternalLink
            action="CityWebsite"
            url={t('serviceList.linkToCityWebsiteInfoBox')}
            ariaLabel={
              t('serviceList.infoPreText') +
              ' ' +
              t('serviceList.linkToCityWebsiteInfoBoxText') +
              ' ' +
              t('serviceList.infoPostText')
            }
          >
            {t('serviceList.linkToCityWebsiteInfoBoxText')}
          </ExternalLink>
          <div aria-hidden="true">{t('serviceList.infoPostText')}</div>
        </div>
      </div>
    </>
  );
}

InfoBox.propTypes = {
  className: PropTypes.string
};
