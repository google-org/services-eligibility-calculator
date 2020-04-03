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

import { Create, List, Show, Update } from '../components/interest';

import { BASEPATH } from '../common/config';
import React from 'react';
import { Route } from 'react-router-dom';
import { withTracker } from './withTracker';

export default [
  <Route
    path={BASEPATH + 'interests/create'}
    component={withTracker(Create)}
    exact
    key="create"
  />,
  <Route
    path={BASEPATH + 'interests/edit/:id'}
    component={withTracker(Update)}
    exact
    key="update"
  />,
  <Route
    path={BASEPATH + 'interests/show/:id'}
    component={withTracker(Show)}
    exact
    key="show"
  />,
  <Route
    path={BASEPATH + 'interests/'}
    component={withTracker(List)}
    exact
    strict
    key="list"
  />
];
