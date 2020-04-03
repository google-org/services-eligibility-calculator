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

import React, { useMemo, useState } from 'react';

import DisplayDate from '../../common/components/service/show/DisplayDate';
import Header from './Header';
import PropTypes from 'prop-types';
import { useUserActivity } from '../../hooks';

const ListRow = function({ activity }) {
  return (
    <tr>
      <td>{activity.displayName}</td>
      <td>{activity.numLogins}</td>
      <td>
        <DisplayDate date={activity.lastLogin} />
      </td>
      <td>{activity.numEdits}</td>
      <td>{activity.numPublished}</td>
      <td>{activity.numArchived}</td>
    </tr>
  );
};

ListRow.propTypes = {
  activity: PropTypes.object.isRequired
};

function ActivityTable({ activities }) {
  // Column titles, can sort by each of these
  const NAME = 'name';
  const LOGINS = 'logins';
  const LAST_LOGIN = 'last logged in';
  const EDITED = 'edited';
  const PUBLISHED = 'published';
  const ARCHIVED = 'archived';

  const [sortChoice, setSortChoice] = useState(NAME);
  const [isAscendingSort, setIsAscendingSort] = useState(true);

  // Handle sorting of services
  const sortedActivity = useMemo(() => {
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

    const numCmp = (a, b) => {
      const diff = (a > b) - (a < b);
      if (isAscendingSort) {
        return diff;
      }
      return -1 * diff;
    };

    const sortActivity = () => {
      let activitiesCopy = [...activities];
      switch (sortChoice) {
        case NAME:
          activitiesCopy.sort((a, b) => textCmp(a.displayName, b.displayName));
          break;
        case LOGINS:
          activitiesCopy.sort(
            (a, b) =>
              numCmp(a.numLogins, b.numLogins) ||
              textCmp(a.displayName, b.displayName)
          );
          break;
        case LAST_LOGIN:
          activitiesCopy.sort(
            (a, b) =>
              dateTextCmp(a.lastLogin, b.lastLogin) ||
              textCmp(a.displayName, b.displayName)
          );
          break;
        case EDITED:
          activitiesCopy.sort(
            (a, b) =>
              numCmp(a.numEdits, b.numEdits) ||
              textCmp(a.displayName, b.displayName)
          );
          break;
        case PUBLISHED:
          activitiesCopy.sort(
            (a, b) =>
              numCmp(a.numPublished, b.numPublished) ||
              textCmp(a.displayName, b.displayName)
          );
          break;
        case ARCHIVED:
          activitiesCopy.sort(
            (a, b) =>
              numCmp(a.numArchived, b.numArchived) || textCmp(a.name, b.name)
          );
          break;
        default:
      }
      return activitiesCopy;
    };

    return sortActivity();
  }, [isAscendingSort, sortChoice, activities]);

  function ColumnHeader({ title, width }) {
    return (
      <th
        style={{
          cursor: 'pointer',
          width: width
        }}
        onClick={() => {
          if (sortChoice === title) {
            setIsAscendingSort(!isAscendingSort);
          } else {
            setSortChoice(title);
            setIsAscendingSort(true);
          }
        }}
      >
        {title}
        {sortChoice === title && isAscendingSort && (
          <i className="material-icons">arrow_downward</i>
        )}
        {sortChoice === title && !isAscendingSort && (
          <i className="material-icons">arrow_upward</i>
        )}
      </th>
    );
  }

  return (
    <>
      {activities && (
        <table className="table table-fixed">
          <thead>
            <tr>
              <ColumnHeader title={NAME} width="40%" />
              <ColumnHeader title={LOGINS} width="12%" />
              <ColumnHeader title={LAST_LOGIN} width="12%" />
              <ColumnHeader title={EDITED} width="12%" />
              <ColumnHeader title={PUBLISHED} width="12%" />
              <ColumnHeader title={ARCHIVED} width="12%" />
            </tr>
          </thead>
          <tbody>
            {sortedActivity.map(activity => {
              return <ListRow key={activity['@id']} activity={activity} />;
            })}
            {sortedActivity.length === 0 && (
              <tr>
                <td className="text-center" colSpan={5}>
                  'No users yet'
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </>
  );
}

ActivityTable.propTypes = {
  activities: PropTypes.array
};

export default function ServiceActivity() {
  const { activities } = useUserActivity();

  return (
    <>
      <Header tab="User activity" />
      {activities && <ActivityTable activities={activities} />}
    </>
  );
}
