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

import Header from './Header';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { base64URLEncode } from '../../common/base64URL';
import { useServiceActivity } from '../../hooks';

const ListRow = function({ activity }) {
  let linkBase = '../services/show/';
  let serviceId = activity['@id'].slice(
    0,
    activity['@id'].indexOf('/activity')
  );
  if (activity.numPublished === 0) {
    linkBase = linkBase.replace('services', 'servicedrafts');
    serviceId = serviceId.replace('services', 'service_drafts');
  }
  return (
    <tr>
      <td>
        <Link
          to={{
            pathname: linkBase + base64URLEncode(serviceId),
            state: { fromSettings: true }
          }}
        >
          {activity.name}
        </Link>
      </td>
      <td>{activity.numEdits}</td>
      <td>{activity.numPublished}</td>
      <td>{activity.hasDraft && 'Yes'}</td>
      <td>{activity.isArchived && 'Yes'}</td>
    </tr>
  );
};

ListRow.propTypes = {
  activity: PropTypes.object.isRequired
};

function ActivityTable({ activities }) {
  // Column titles, can sort by each of these
  const NAME = 'name';
  const EDITED = 'edited';
  const PUBLISHED = 'published';
  const DRAFT = 'has draft?';
  const ARCHIVED = 'is archived?';

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

    const numCmp = (a, b) => {
      const diff = (a > b) - (a < b);
      if (isAscendingSort) {
        return diff;
      }
      return -1 * diff;
    };

    const boolCmp = (a, b) => {
      const diff = a === b ? 0 : a ? -1 : 1;
      if (isAscendingSort) {
        return diff;
      }
      return -1 * diff;
    };

    const sortActivity = () => {
      let activitiesCopy = [...activities];
      switch (sortChoice) {
        case NAME:
          activitiesCopy.sort((a, b) => textCmp(a.name, b.name));
          break;
        case EDITED:
          activitiesCopy.sort(
            (a, b) => numCmp(a.numEdits, b.numEdits) || textCmp(a.name, b.name)
          );
          break;
        case PUBLISHED:
          activitiesCopy.sort(
            (a, b) =>
              numCmp(a.numPublished, b.numPublished) || textCmp(a.name, b.name)
          );
          break;
        case DRAFT:
          activitiesCopy.sort(
            (a, b) => boolCmp(a.hasDraft, b.hasDraft) || textCmp(a.name, b.name)
          );
          break;
        case ARCHIVED:
          activitiesCopy.sort(
            (a, b) =>
              boolCmp(a.isArchived, b.isArchived) || textCmp(a.name, b.name)
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
              <ColumnHeader title={NAME} width="32%" />
              <ColumnHeader title={EDITED} width="17%" />
              <ColumnHeader title={PUBLISHED} width="17%" />
              <ColumnHeader title={DRAFT} width="17%" />
              <ColumnHeader title={ARCHIVED} width="17%" />
            </tr>
          </thead>
          <tbody>
            {sortedActivity.map(activity => {
              return <ListRow key={activity['@id']} activity={activity} />;
            })}
            {sortedActivity.length === 0 && (
              <tr>
                <td className="text-center" colSpan={5}>
                  'No services yet'
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
  const { activities } = useServiceActivity();

  return (
    <>
      <Header tab="Service activity" />
      {activities && <ActivityTable activities={activities} />}
    </>
  );
}
