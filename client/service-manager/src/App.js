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

import './i18n';

import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import React, { createContext, useState } from 'react';
import {
  getLoggedInUser,
  getMillisUntilExpiration,
  isLoggedIn
} from './common/auth';

import { ANALYTICS_ID } from './common/config';
import { BASEPATH } from './common/config';
import Header from './components/Header';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import Toast from './components/Toast';
import departmentRoutes from './routes/department';
import getUserConfirmation from './getUserConfirmation';
import interestRoutes from './routes/interest';
import serviceRoutes from './routes/service';
import settingsRoutes from './routes/settings';
import { useSettings } from './hooks';

export const AuthContext = createContext();
export const ToastContext = createContext();
export const SettingsContext = createContext();

export default function App(props) {
  ReactGA.initialize(ANALYTICS_ID, { testMode: props.testMode });

  const [loginState, setLoginState] = useState({
    isLoggedIn: isLoggedIn(),
    loggedInUser: getLoggedInUser()
  });

  const onLoginStatusChanged = () => {
    //setTimeout to update when token might expire.
    const millis = getMillisUntilExpiration();
    millis && setTimeout(onLoginStatusChanged, millis);

    setLoginState({
      isLoggedIn: isLoggedIn(),
      loggedInUser: getLoggedInUser()
    });
  };

  const { settings, setSettings } = useSettings();

  const [toastMessage, setToastMessage] = useState(null);

  return (
    <AuthContext.Provider value={{ ...loginState, onLoginStatusChanged }}>
      <SettingsContext.Provider value={{ settings, setSettings }}>
        <ToastContext.Provider value={{ toastMessage, setToastMessage }}>
          <BrowserRouter getUserConfirmation={getUserConfirmation}>
            <Header />
            <div className="container bd-content">
              <Switch>
                {serviceRoutes}
                {settingsRoutes}
                {interestRoutes}
                {departmentRoutes}
                <Redirect from={BASEPATH} exact to={BASEPATH + 'services/'} />
                <Route render={() => <h1>Not Found</h1>} />
              </Switch>
            </div>
            {toastMessage && <Toast message={toastMessage} />}
          </BrowserRouter>
        </ToastContext.Provider>
      </SettingsContext.Provider>
    </AuthContext.Provider>
  );
}

App.propTypes = {
  testMode: PropTypes.bool
};
