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

import {
  SERVICE_TYPE_ARCHIVED,
  SERVICE_TYPE_DRAFT,
  SERVICE_TYPE_HISTORY_VERSION
} from '../../common/utils/serviceTypes';

import { IconButton } from '@material-ui/core';
import { Navbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function StickyHeader({
  title,
  backLink,
  serviceType,
  actionButtons
}) {
  let history = useHistory();
  return (
    <Navbar className="service-header" sticky="top">
      <div className="w-100">
        <h1 className="float-left">
          <IconButton
            onClick={_ => history.push(backLink)}
            className="material-icons arrow-back"
          >
            arrow_back
          </IconButton>
          {title}
          {serviceType === SERVICE_TYPE_DRAFT && (
            <span className="badge badge-draft">Draft</span>
          )}
          {serviceType === SERVICE_TYPE_ARCHIVED && (
            <span className="badge badge-archived">Archived</span>
          )}
          {serviceType === SERVICE_TYPE_HISTORY_VERSION && (
            <span className="badge badge-old-version">Historical Version</span>
          )}
        </h1>
        {actionButtons}
      </div>
    </Navbar>
  );
}

StickyHeader.propTypes = {
  title: PropTypes.string.isRequired,
  serviceType: PropTypes.string.isRequired,
  actionButtons: PropTypes.object.isRequired
};
