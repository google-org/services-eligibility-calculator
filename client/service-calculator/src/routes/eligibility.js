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
import { Route } from 'react-router-dom';
import Show from '../components/service/Show';
import { BASEPATH } from '../common/config';
import { withTracker } from './withTracker';
import Placeholder from '../components/service/Placeholder';

export default [
  <Route
    path={BASEPATH + 'services/:id'}
    component={withTracker(Show)}
    exact
    key="services"
  />,
  <Route
    path={BASEPATH}
    component={withTracker(Placeholder)}
    exact
    key="placeholder"
  />
];
