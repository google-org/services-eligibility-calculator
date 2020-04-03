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

import PropTypes from 'prop-types';
import React from 'react';

import { useTranslation } from 'react-i18next';

export default function DisplayDate({ date }) {
  const { i18n } = useTranslation();

  if (!date) {
    return <></>;
  }

  const utcDate = new Date(date);
  const localDate = new Date(
    utcDate.valueOf() + utcDate.getTimezoneOffset() * 60000
  );
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return <>{localDate.toLocaleDateString(i18n.languages, dateOptions)}</>;
}

DisplayDate.propTypes = {
  date: PropTypes.string
};
