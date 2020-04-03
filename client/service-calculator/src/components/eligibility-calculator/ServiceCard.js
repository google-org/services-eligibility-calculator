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

import { BASEPATH } from '../../common/config';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import React from 'react';
import { base64URLEncode } from '../../common/base64URL';

export function ServiceCard({ service, selected }) {
  return (
    <div className="col-6 col-md-4 col-lg-3 col-xl-6 card-col">
      <Link
        className="no-text-decoration"
        to={`${BASEPATH}services/${base64URLEncode(service['@id'])}`}
      >
        <Card className={`${selected ? 'selected' : ''}`}>
          <Card.Body>
            <i className="material-icons card-icon" aria-hidden="true">
              {(service.interests &&
                service.interests.length > 0 &&
                service.interests[0].materialIcon) ||
                'texture'}
            </i>
            <p className="card-text">{service.name}</p>
          </Card.Body>
        </Card>
      </Link>
    </div>
  );
}
