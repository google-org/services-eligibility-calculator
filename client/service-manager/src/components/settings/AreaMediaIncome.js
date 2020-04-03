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

import IncomeSection from './IncomeSection.js';
import PropTypes from 'prop-types';
import { SettingsContext } from '../../App.js';
import saveSetting from './saveSetting.js';

export default function AreaMedianIncome() {
  const { settings, setSettings } = useContext(SettingsContext);

  return (
    settings && (
      <IncomeSection
        title="Area Median Income (AMI)"
        helpText="Content managers will use these values to autocalculate income percentages, such as 30% AMI"
        initialValues={{
          income: settings && settings.ami ? settings.ami : Array(8).fill(0)
        }}
        onSave={async values => {
          let settingsSaved = await saveSetting('ami', values.income);
          if (settingsSaved) {
            setSettings({ ...settings, ami: values.income });
          }
          return settingsSaved;
        }}
      />
    )
  );
}

AreaMedianIncome.propTypes = {
  settings: PropTypes.object
};
