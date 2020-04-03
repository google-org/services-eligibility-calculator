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

import './HistoryCard.css';

import { Col, Row } from 'react-bootstrap';
import React, { useContext } from 'react';

import { AuthContext } from '../../App';
import { BASEPATH } from '../../common/config';
import Card from '../../common/components/service/Card.js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { SERVICE_TYPE_DRAFT } from '../../common/utils/serviceTypes';
import { base64URLEncode } from '../../common/base64URL';
import { lastModifiedByDisplayName } from '../../common/utils';

/**
 * Card used for displaying history details about a service.
 */
export default function HistoryCard({ history, serviceId, serviceType }) {
  const loginState = useContext(AuthContext);
  const loggedInUsername = loginState && loginState.loggedInUser.username;
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

  const viewLink = ind => {
    if (ind === history.length - 1) {
      return `${BASEPATH}services/show/${base64URLEncode(
        `/api/services/${serviceId}`
      )}`;
    }
    return {
      pathname: `${BASEPATH}servicehistories/show/${base64URLEncode(
        history[ind]['@id']
      )}`,
      state: {
        serviceHistory: history.slice(0, ind + 1)
      }
    };
  };

  return (
    <Card title="History">
      <div className="history-card">
        {history &&
          history.length > 0 &&
          history.map((change, ind) => (
            <Row key={change.revision}>
              <Col md={8}>
                Modified on{' '}
                {new Date(change.lastModifiedDateTime).toLocaleDateString(
                  undefined,
                  dateOptions
                )}{' '}
                by {lastModifiedByDisplayName(change, loggedInUsername)}
              </Col>
              <Col md={4}>
                {(ind !== history.length - 1 ||
                  serviceType === SERVICE_TYPE_DRAFT) && (
                  <Link
                    to={viewLink(ind)}
                    className="btn btn-blue-text pull-right"
                    role="button"
                  >
                    View
                  </Link>
                )}
              </Col>
              <hr />
            </Row>
          ))}
        {(!history || history.length === 0) && 'No history available yet'}
      </div>
    </Card>
  );
}

HistoryCard.propTypes = {
  history: PropTypes.array,
  serviceId: PropTypes.string,
  serviceType: PropTypes.string.isRequired
};
