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

import { AuthContext, SettingsContext } from '../App';
import React, { useContext, useEffect, useState } from 'react';

import { BASEPATH } from '../common/config';
import { Dropdown } from 'react-bootstrap';
import HtmlText from '../common/components/service/show/HtmlText';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Login from './Login';
import ReactGA from 'react-ga';
import { hasRole } from '../common/utils';
import { logout } from '../common/auth';
import { useTranslation } from 'react-i18next';

export default function Header(props) {
  const { settings } = useContext(SettingsContext);
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn, loggedInUser, onLoginStatusChanged } = useContext(
    AuthContext
  );

  useEffect(() => {
    !isLoggedIn && setShowLogin(true);
  }, [isLoggedIn]);

  const CustomToggle = React.forwardRef(({ onClick }, ref) => (
    <IconButton
      className="ron logged-in material-icons"
      title={isLoggedIn ? loggedInUser.displayName : ''}
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      person_outline
    </IconButton>
  ));

  return (
    <>
      {showLogin && <Login onCancel={() => setShowLogin(false)}></Login>}
      <div className="app-header">
        <img alt="logo" className="circle" src={BASEPATH + 'logo192.png'} />
        <div className="rectangle">{t('serviceList.pageTitle')}</div>
        {hasRole(loggedInUser, 'ROLE_ADMIN') && (
          <Link to={BASEPATH + 'settings/manage'} className="settings">
            <i className="material-icons-outlined">settings</i>
          </Link>
        )}
        <div className="login">
          {!isLoggedIn && (
            <>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="btn btn-blue-text mx-1 my-auto"
              >
                Login
              </button>
              <div
                className="ron logged-out"
                onClick={() => setShowLogin(true)}
                title="login"
              >
                <i className="material-icons">person_outline</i>
              </div>
            </>
          )}
          {isLoggedIn && (
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu alignRight>
                <Dropdown.Item
                  onClick={() => {
                    logout();
                    onLoginStatusChanged();
                    ReactGA.event({
                      category: 'Auth',
                      action: 'Logout',
                      label: 'Success'
                    });
                  }}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      {settings && settings.infoBanner && (
        <div className="info-header">
          <div className="mr-3">
            <i className="material-icons align-middle">info_outline</i>
          </div>
          <HtmlText html={settings.infoBanner} />
        </div>
      )}
    </>
  );
}
