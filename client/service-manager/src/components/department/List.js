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
import { defaultLocale, localeLanguage } from '../../Locales.js';

import { AuthContext } from '../../App.js';
import Card from '../../common/components/service/Card.js';
import Create from './Create';
import Show from './Show';
import Update from './Update';
import { base64URLEncode } from '../../common/base64URL';
import { hasRole } from '../../common/utils/index.js';
import { nonDefaultLocales } from '../namedTranslatedEntity.js';
import { useTranslatedDepartments } from '../../hooks';

function ListRow({ department, translations, onManage }) {
  return (
    <div
      key={department['@id']}
      className="d-flex justify-content-between mb-3"
    >
      <div>
        <span>{department['name']}</span>
        {translations && (
          <>
            <span className="ml-1">
              (
              {Object.entries(translations).map(([locale, translation]) => (
                <i key={locale}>
                  {localeLanguage(locale)}: {translation['name']}
                </i>
              ))}
              )
            </span>
          </>
        )}
      </div>{' '}
      <div>
        {onManage && (
          <button className="btn btn-blue-text pull-right" onClick={onManage}>
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

export default function List() {
  const { departments, fetchDepartments } = useTranslatedDepartments();
  const { loggedInUser } = useContext(AuthContext);
  const isAdmin = hasRole(loggedInUser, 'ROLE_ADMIN');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [departmentId, setDepartmentId] = useState(undefined);

  return (
    <Card
      header={
        <div className="d-flex justify-content-between">
          <div>Departments</div>
          <div>
            {isAdmin && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreate(true)}
              >
                Add department
              </button>
            )}
          </div>
        </div>
      }
    >
      {showCreate && (
        <Create
          onCancel={() => {
            setShowCreate(false);
            fetchDepartments();
          }}
        />
      )}
      {departmentId && !showEdit && (
        <Show
          onCancel={() => {
            setDepartmentId(undefined);
            fetchDepartments();
          }}
          departmentId={departmentId}
          onEdit={() => setShowEdit(true)}
        />
      )}
      {departmentId && showEdit && (
        <Update
          departmentId={departmentId}
          onCancel={() => {
            setShowEdit(false);
            fetchDepartments();
          }}
          onRemove={() => {
            // Fully unwind the stack of modals so none of them try to
            // display the deleted item.
            setShowEdit(false);
            setDepartmentId(undefined);
          }}
        />
      )}
      {departments &&
        departments[defaultLocale] &&
        departments[defaultLocale].map(department => (
          <ListRow
            key={department['@id']}
            department={department}
            translations={nonDefaultLocales(department['@id'], departments)}
            onManage={
              isAdmin &&
              (() => {
                setDepartmentId(base64URLEncode(department['@id']));
              })
            }
          />
        ))}
    </Card>
  );
}
