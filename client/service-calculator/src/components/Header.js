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

import { BASEPATH } from '../common/config';
import { DataContext } from '../DataContext';
import HtmlText from '../common/components/service/show/HtmlText';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { settings } = useContext(DataContext);
  const { t } = useTranslation();

  return (
    <>
      <div className="app-header">
        <img alt="" className="circle" src={BASEPATH + 'logo192.png'} />
        <div className="rectangle">{t('serviceList.pageTitle')}</div>
      </div>
      {settings && settings.infoBanner && (
        <div className="info-header">
          <div className="mr-3">
            <i className="material-icons align-middle" aria-hidden="true">
              info_outline
            </i>
          </div>
          <HtmlText html={settings.infoBanner} />
        </div>
      )}
    </>
  );
}
