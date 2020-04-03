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

import './Card.css';

import React, { useRef, useState } from 'react';

import BootstrapCard from 'react-bootstrap/Card';
import { IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * Card used for displaying different parts of service details.
 */
export default function Card(props) {
  const [collapsed, setCollapsed] = useState(false);
  const cardRef = useRef(null);
  const { t } = useTranslation();
  let header = (
    <>
      {props.title}
      {props.header}
      {props.collapsible && (
        <IconButton
          onClick={() => {
            setCollapsed(!collapsed);
            cardRef.current && cardRef.current.focus();
          }}
          className="card-collapse-icon float-right material-icons align-middle"
          aria-label={
            collapsed
              ? t('serviceDetails.maximizeButton')
              : t('serviceDetails.minimizeButton')
          }
        >
          {collapsed ? 'add' : 'remove'}
        </IconButton>
      )}
    </>
  );
  let body = collapsed ? header : props.children;
  return (
    <BootstrapCard className="service-card" ref={cardRef} tabIndex="-1">
      {!collapsed && (props.title || props.header) && (
        <BootstrapCard.Header>{header}</BootstrapCard.Header>
      )}
      <BootstrapCard.Body className={collapsed ? 'collapsed' : ''}>
        {body}
      </BootstrapCard.Body>
    </BootstrapCard>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  header: PropTypes.object
};
