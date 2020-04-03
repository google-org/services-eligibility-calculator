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

import { Col, Row } from 'react-bootstrap';
import React, { useContext } from 'react';

import { BASEPATH } from '../common/config';
import { DataContext } from '../DataContext';
import Header from './Header';
import InfoBox from './InfoBox';
import Results from './eligibility-calculator/Results';
import { Switch } from 'react-router-dom';
import { base64URLDecode } from '../common/base64URL';
import eligibilityRoutes from '../routes/eligibility';
import { useRouteMatch } from 'react-router-dom';

function ResultsContainer() {
  let match = useRouteMatch({ path: BASEPATH + 'services/:id', exact: true });
  return (
    <Col
      xs={12}
      xl={4}
      className={`d-xl-block px-xl-4 col-scrollable col-scrollable-left ${
        match && match.params.id ? 'd-none' : ''
      }`}
    >
      <Results
        selectedId={
          match && match.params.id && base64URLDecode(match.params.id)
        }
      />
      <InfoBox className="d-none d-xl-block" />
    </Col>
  );
}

export function Body() {
  const { settings } = useContext(DataContext);

  return (
    <div className="non-footer">
      <Header />
      <div
        className={
          'container-fluid' +
          (settings && settings.infoBanner ? ' with-info-banner' : '')
        }
      >
        <Row className="row-scrollable mx-xl-0">
          <ResultsContainer />
          <Col
            xs={12}
            xl={8}
            className="px-xl-4 col-scrollable"
            id="col-scrollable-right"
          >
            <Switch>{eligibilityRoutes}</Switch>
          </Col>
        </Row>
      </div>
      <InfoBox className="d-xl-none" />
    </div>
  );
}
