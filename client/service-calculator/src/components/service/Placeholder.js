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

import React from 'react';

import servicePlaceholder from './service-placeholder.png';
import { useTranslation } from 'react-i18next';

export default function Placeholder() {
  const { t } = useTranslation();

  return (
    <div className="row d-none d-xl-flex h-100 justify-content-center align-items-center">
      <div className="text-center">
        <img className="placeholder" src={servicePlaceholder} alt="Logo" />
        <h2 className="mt-0 mb-5">{t('serviceList.selectService')}</h2>
      </div>
    </div>
  );
}
