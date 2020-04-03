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

import { Col, Row } from 'react-bootstrap';
import React, { useMemo } from 'react';
import { SearchableText, fuseOptions } from './Search';
import {
  hasRole,
  lastModifiedByDisplayName,
  sharedByDisplayName
} from '../../../common/utils';

import { AuthContext } from '../../../App';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { base64URLEncode } from '../../../common/base64URL';
import { useDrafts } from '../../../hooks';

export default function Drafts({ lastSearch }) {
  const { drafts } = useDrafts();
  const loginState = React.useContext(AuthContext);
  const loggedInUsername = loginState && loginState.loggedInUser.username;
  const isAdmin = hasRole(loginState.loggedInUser, 'ROLE_ADMIN');

  const fuseIndex = useMemo(
    () => (drafts ? new Fuse(drafts, fuseOptions) : null),
    [drafts]
  );
  const filteredDrafts = useMemo(
    () =>
      lastSearch === '' ? drafts : fuseIndex && fuseIndex.search(lastSearch),
    [fuseIndex, lastSearch, drafts]
  );

  return (
    <>
      <h2 className="list float-left">
        {isAdmin ? 'All' : 'Your'} draft services (
        {(filteredDrafts && filteredDrafts.length) || 0})
      </h2>
      <div className="float-right">
        <Row>
          {loginState.isLoggedIn && (
            <Col>
              <Link
                to={'../servicedrafts/create'}
                className="btn btn-primary pull-right"
                role="button"
              >
                Add service
              </Link>
            </Col>
          )}
        </Row>
      </div>
      <div className="mb-5">
        {filteredDrafts && (
          <>
            {filteredDrafts.map(result => {
              let draft = result.item || result;
              let matches = result.matches;
              let sharedBy = sharedByDisplayName(draft, loggedInUsername);
              return (
                <div className="row service-draft-row my-2" key={draft['@id']}>
                  <div className="col-6 my-auto service-draft-name">
                    <SearchableText
                      text={draft.name}
                      match={
                        matches && matches.find(match => match.key === 'name')
                      }
                    />
                  </div>
                  {draft.lastModifiedAgo && (
                    <div className="col my-auto">
                      {draft.createdBy !== loggedInUsername && sharedBy && (
                        <div className="row draft-shared-by">
                          <i className="material-icons">share</i> Shared by{' '}
                          {sharedBy}
                        </div>
                      )}
                      <div className="row draft-last-updated">
                        Last updated {draft.lastModifiedAgo} by&nbsp;
                        <SearchableText
                          text={lastModifiedByDisplayName(
                            draft,
                            loggedInUsername
                          )}
                          match={
                            matches &&
                            matches.find(
                              match => match.key === 'lastModifiedByDisplayName'
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                  <div className="col my-auto">
                    <Link
                      to={`../servicedrafts/show/${base64URLEncode(
                        draft['@id']
                      )}`}
                      className="btn btn-blue-text pull-right"
                      role="button"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              );
            })}
            {filteredDrafts.length === 0 && (
              <div className="row service-draft-row my-2 empty">
                <div className="col-12 text-center my-auto">
                  {lastSearch === ''
                    ? 'No drafts yet'
                    : 'No drafts match your search'}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

Drafts.propTypes = {
  onSearch: PropTypes.func
};
