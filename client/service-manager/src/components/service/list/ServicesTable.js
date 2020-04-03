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

import './List.css';

import React, { useMemo, useState } from 'react';
import { SearchableText, fuseOptions } from './Search';
import {
  archivedByDisplayName,
  canManageService,
  lastModifiedByDisplayName
} from '../../../common/utils';

import { AuthContext } from '../../../App';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { base64URLEncode } from '../../../common/base64URL';

/** Displays a single service as a row of the services table */
const ListRow = function({
  service,
  matches,
  archived,
  loggedInUsername,
  loginState
}) {
  return (
    <tr>
      <td>
        <SearchableText
          text={service.name}
          match={matches && matches.find(match => match.key === 'name')}
        />
      </td>
      <td>
        <SearchableText
          text={service.department && service.department.name}
          match={
            matches && matches.find(match => match.key === 'department.name')
          }
        />
      </td>
      <td>
        <SearchableText
          text={
            archived
              ? archivedByDisplayName(service, loggedInUsername)
              : lastModifiedByDisplayName(service, loggedInUsername)
          }
          match={
            matches &&
            matches.find(
              match =>
                match.key ===
                (archived
                  ? 'archivedByDisplayName'
                  : 'lastModifiedByDisplayName')
            )
          }
        />
      </td>
      <td>{archived ? service.archivedAgo : service['lastModifiedAgo']}</td>
      <td>
        <Link
          to={`show/${base64URLEncode(service['@id'])}`}
          className="btn btn-blue-text pull-right"
          role="button"
        >
          {canManageService(loginState.loggedInUser, service)
            ? 'Manage'
            : 'View'}
        </Link>
      </td>
    </tr>
  );
};

export default function ServicesTable({ lastSearch, archived, services }) {
  // Column titles, can sort by each of these
  const NAME = 'name';
  const DEPARTMENT = 'department';
  const LAST_MODIFIED_BY = 'last modified by';
  const LAST_MODIFIED = 'last modified';
  const ARCHIVED_BY = 'archived by';
  const ARCHIVED = 'archived';

  const fuseIndex = useMemo(
    () => (services ? new Fuse(services, fuseOptions) : null),
    [services]
  );
  const [sortChoice, setSortChoice] = useState(NAME);
  const [isAscendingSort, setIsAscendingSort] = useState(true);
  const loginState = React.useContext(AuthContext);
  const loggedInUsername = loginState && loginState.loggedInUser.username;
  const collectionName = archived ? 'archived services' : 'published services';

  // Handle filtering and sorting of services
  const filteredServices = useMemo(() => {
    const textCmp = (a, b) => {
      a = a || '';
      b = b || '';
      const diff = a.toLowerCase().localeCompare(b.toLowerCase());
      if (isAscendingSort) {
        return diff;
      }
      return -1 * diff;
    };

    const dateTextCmp = (a, b) => {
      var aDate = new Date(a);
      var bDate = new Date(b);
      const diff = (aDate > bDate) - (aDate < bDate);
      if (isAscendingSort) {
        return diff;
      }
      return -1 * diff;
    };

    const sortServices = () => {
      let servicesCopy = [...services];
      switch (sortChoice) {
        case NAME:
          servicesCopy.sort((a, b) => textCmp(a.name, b.name));
          break;
        case DEPARTMENT:
          servicesCopy.sort((a, b) => {
            const departmentA = a.department ? a.department.name : '';
            const departmentB = b.department ? b.department.name : '';
            return textCmp(departmentA, departmentB);
          });
          break;
        case ARCHIVED_BY:
          servicesCopy.sort((a, b) =>
            textCmp(
              archivedByDisplayName(a, loggedInUsername),
              archivedByDisplayName(b, loggedInUsername)
            )
          );
          break;
        case LAST_MODIFIED_BY:
          servicesCopy.sort((a, b) =>
            textCmp(
              lastModifiedByDisplayName(a, loggedInUsername),
              lastModifiedByDisplayName(b, loggedInUsername)
            )
          );
          break;
        case ARCHIVED:
          servicesCopy.sort((a, b) =>
            dateTextCmp(a.archivedDateTime, b.archivedDateTime)
          );
          break;
        case LAST_MODIFIED:
          servicesCopy.sort((a, b) =>
            dateTextCmp(a.lastModifiedDateTime, b.lastModifiedDateTime)
          );
          break;
        default:
      }
      return servicesCopy;
    };

    return lastSearch === ''
      ? sortServices()
      : fuseIndex && fuseIndex.search(lastSearch);
  }, [
    isAscendingSort,
    sortChoice,
    lastSearch,
    loggedInUsername,
    services,
    fuseIndex
  ]);

  function ColumnHeader({ title, width }) {
    return (
      <th
        style={{
          cursor: lastSearch === '' ? 'pointer' : 'default',
          width: width
        }}
        onClick={() => {
          if (lastSearch !== '') return;
          if (sortChoice === title) {
            setIsAscendingSort(!isAscendingSort);
          } else {
            setSortChoice(title);
            setIsAscendingSort(true);
          }
        }}
      >
        {title}
        {lastSearch === '' && sortChoice === title && isAscendingSort && (
          <i className="material-icons">arrow_downward</i>
        )}
        {lastSearch === '' && sortChoice === title && !isAscendingSort && (
          <i className="material-icons">arrow_upward</i>
        )}
      </th>
    );
  }

  return (
    <>
      <h2 className="list">
        {archived ? 'Archived services' : 'All published services'} (
        {(filteredServices && filteredServices.length) || 0})
      </h2>
      {filteredServices && (
        <table className="table table-fixed">
          <thead>
            <tr>
              <ColumnHeader title={NAME} width="30%" />
              <ColumnHeader title={DEPARTMENT} width="20%" />
              <ColumnHeader
                title={archived ? ARCHIVED_BY : LAST_MODIFIED_BY}
                width="20%"
              />
              <ColumnHeader
                title={archived ? ARCHIVED : LAST_MODIFIED}
                width="15%"
              />
              <th style={{ width: '15%' }} />
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(result => {
              let service = result.item || result;
              return (
                <ListRow
                  key={service['@id']}
                  service={service}
                  matches={result.matches}
                  archived={archived}
                  loggedInUsername={loggedInUsername}
                  loginState={loginState}
                />
              );
            })}
            {filteredServices.length === 0 && (
              <tr>
                <td className="text-center" colSpan={5}>
                  {lastSearch === ''
                    ? `No ${collectionName} yet`
                    : `No ${collectionName} match your search`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

ServicesTable.propTypes = {
  services: PropTypes.array.isRequired,
  archived: PropTypes.bool,
  lastSearch: PropTypes.string.isRequired
};
