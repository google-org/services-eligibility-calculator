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

import './Show.css';

import Card from '../Card';
import DisplayDate from './DisplayDate';
import HtmlText from './HtmlText';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const acceptingApplicationsData = (entity, t) => {
  const currentlyAccepting = {
    class: 'accepting-applications',
    text: t('serviceDetails.overviewCard.acceptingApplications'),
    icon: 'check_circle_outline'
  };

  const notAccepting = {
    class: 'not-accepting-applications',
    text: t('serviceDetails.overviewCard.notAcceptingApplications'),
    icon: 'cancel'
  };

  const acceptingInTheFuture = {
    class: 'accepting-applications-future',
    text: t('serviceDetails.overviewCard.acceptingApplicationsStarting'),
    icon: 'schedule'
  };

  if (entity.alwaysAcceptApplications) return currentlyAccepting;

  const start = entity.applicationWindowStart;
  const end = entity.applicationWindowEnd;
  if (!start && !end) return notAccepting;

  const today = new Date();
  if (
    (!start || new Date(start) <= today) &&
    (!end || new Date(entity.applicationWindowEnd) >= today)
  ) {
    return currentlyAccepting;
  }

  if (start && new Date(start) > today) {
    return {
      ...acceptingInTheFuture,
      text: (
        <>
          {acceptingInTheFuture.text}
          <DisplayDate date={start} />
        </>
      )
    };
  }

  return notAccepting;
};

/**
 * Card used for displaying an overview of a service.
 */
export default function OverviewCard({ service, children, hideTitle }) {
  const { t } = useTranslation();
  let data = acceptingApplicationsData(service, t);
  return (
    <Card>
      {!hideTitle && <div className="service-title">{service.name}</div>}
      {service.description && (
        <div style={{ fontSize: '16px' }}>
          <HtmlText html={service.description} />
        </div>
      )}
      <div className={data.class + ' inline box'}>
        <div>
          <i className="material-icons" aria-hidden="true">
            {data.icon}
          </i>
        </div>
        <div>{data.text}</div>
      </div>
      {children}
    </Card>
  );
}

OverviewCard.propTypes = {
  service: PropTypes.object.isRequired,
  children: PropTypes.node,
  hideTitle: PropTypes.bool
};
