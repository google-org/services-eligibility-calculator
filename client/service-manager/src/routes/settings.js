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

import { Manage, ServiceActivity, UserActivity } from '../components/settings/';

import { BASEPATH } from '../common/config';
import React from 'react';
import { Route } from 'react-router-dom';
import { withTracker } from './withTracker';

export default [
  <Route
    path={BASEPATH + 'settings/manage'}
    component={withTracker(Manage)}
    exact
    key="manage"
  />,
  <Route
    path={BASEPATH + 'settings/service-activity'}
    component={withTracker(ServiceActivity)}
    exact
    key="service-activity"
  />,
  <Route
    path={BASEPATH + 'settings/user-activity'}
    component={withTracker(UserActivity)}
    exact
    key="user-activity"
  />
];
