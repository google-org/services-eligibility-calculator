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

import './Header.css';

import { BASEPATH } from '../../common/config';
import Helmet from 'react-helmet';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

const Tab = ({ name, to, tab }) => {
  return (
    <span className={'tab col-2' + (tab === name ? ' active' : '')}>
      <Link to={to}>{name}</Link>
      <div className="tab-border" />
    </span>
  );
};

export default function Header({ tab }) {
  let history = useHistory();
  return (
    <>
      <Helmet>
        <title>Settings: {tab}</title>
      </Helmet>
      <Navbar className="service-header" sticky="top">
        <div className="w-100">
          <h1 className="float-left">
            <IconButton
              onClick={_ => history.push(`${BASEPATH}services/`)}
              className="material-icons arrow-back"
            >
              arrow_back
            </IconButton>
            Settings
          </h1>
        </div>
      </Navbar>
      <div className="settings-tabs d-flex">
        <Tab
          name="Service management"
          tab={tab}
          to={BASEPATH + 'settings/manage'}
        />
        <Tab
          name="Service activity"
          tab={tab}
          to={BASEPATH + 'settings/service-activity'}
        />
        <Tab
          name="User activity"
          tab={tab}
          to={BASEPATH + 'settings/user-activity'}
        />
      </div>
    </>
  );
}

Header.propTypes = {
  tab: PropTypes.string.isRequired
};
