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

import React, { createContext, useState } from 'react';

import { ANALYTICS_ID } from './common/config';
import { Body } from './components/Body';
import { DataContext } from './DataContext';
import Footer from './components/Footer';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { Router } from 'react-router-dom';
import ScrollToTop from './common/utils/ScrollToTop';
import { createBrowserHistory } from 'history';

export const FilterContext = createContext();

export const createInitialFilterState = () => ({
  income: undefined,
  interests: {},
  people: {}
});

const history = createBrowserHistory();

export default function App(props) {
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
  const [lastSearch, setLastSearch] = useState('');
  const [filterState, setFilterState] = useState(createInitialFilterState());
  const resetFilterState = () => setFilterState(createInitialFilterState());

  if (!analyticsInitialized) {
    ReactGA.initialize(ANALYTICS_ID, { testMode: props.testMode });
    setAnalyticsInitialized(true);
  }

  return (
    <DataContext.StateProvider>
      <FilterContext.Provider
        value={{
          filterState,
          setFilterState,
          resetFilterState,
          lastSearch,
          setLastSearch
        }}
      >
        <Router history={history}>
          <ScrollToTop />
          <Body />
          <Footer />
        </Router>
      </FilterContext.Provider>
    </DataContext.StateProvider>
  );
}

App.propTypes = {
  testMode: PropTypes.bool
};
