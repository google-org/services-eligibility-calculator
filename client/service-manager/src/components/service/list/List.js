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

import React, { useContext, useState } from 'react';
import { useArchivedServices, useServices } from '../../../hooks';

import { AuthContext } from '../../../App';
import DraftsList from './DraftsList';
import { Helmet } from 'react-helmet';
import { Navbar } from 'react-bootstrap';
import SearchBar from './Search';
import ServicesTable from './ServicesTable';

export default function ListServices() {
  const { services, fetchServices } = useServices();
  const { archivedServices, fetchArchivedServices } = useArchivedServices();
  const { isLoggedIn } = useContext(AuthContext);
  const [wasloggedIn, setWasLoggedIn] = useState(isLoggedIn);
  const [lastSearch, setLastSearch] = useState('');

  if (isLoggedIn !== wasloggedIn) {
    setWasLoggedIn(isLoggedIn);
    fetchServices();
    fetchArchivedServices();
  }

  return (
    <>
      <Helmet>
        <title>{process.env.REACT_APP_MANAGER_TITLE}</title>
      </Helmet>
      <Navbar className="service-header">
        <div className="w-100">
          <h1 className="list float-left">
            {process.env.REACT_APP_MANAGER_TITLE}
          </h1>
          <SearchBar onSearch={setLastSearch} />
        </div>
      </Navbar>

      {isLoggedIn && <DraftsList lastSearch={lastSearch} />}
      {services && (
        <ServicesTable services={services} lastSearch={lastSearch} />
      )}
      {archivedServices && (
        <ServicesTable
          services={archivedServices}
          lastSearch={lastSearch}
          archived
        />
      )}
    </>
  );
}
