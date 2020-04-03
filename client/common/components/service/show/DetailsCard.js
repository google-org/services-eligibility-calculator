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

import { Col, Row } from 'react-bootstrap';

import Card from '../Card';
import DisplayDate from './DisplayDate';
import HtmlText from './HtmlText';
import PropTypes from 'prop-types';
import React from 'react';
import RenderLinks from '../../RenderLinks';
import { useTranslation } from 'react-i18next';

/**
 * Card used for displaying service details.
 */
export default function DetailsCard({ service }) {
  const { t } = useTranslation();

  return (
    <Card collapsible title={t('serviceDetails.detailsCard.whatIsTheService')}>
      <Row>
        <Col>{service.details && <HtmlText html={service.details} />}</Col>
      </Row>
      {service.department && (
        <Row>
          <Col md={4} className="label">
            {t('serviceDetails.detailsCard.department')}:
          </Col>
          <Col className="text-break">
            <RenderLinks type="departments" items={service.department} />
          </Col>
        </Row>
      )}
      {(service.alwaysAcceptApplications ||
        (service.applicationWindowStart && service.applicationWindowEnd)) && (
        <Row>
          <Col md={4} className="label">
            {t('serviceDetails.detailsCard.applicationWindow')}:
          </Col>
          <Col className="text-break">
            {service.alwaysAcceptApplications &&
              t('serviceDetails.detailsCard.alwaysAcceptingApplications')}
            {!service.alwaysAcceptApplications && (
              <>
                <DisplayDate date={service.applicationWindowStart} />
                {t('serviceDetails.detailsCard.dateRangeSeparator')}
                <DisplayDate date={service.applicationWindowEnd} />
              </>
            )}
          </Col>
        </Row>
      )}
      {service.interests && service.interests.length > 0 && (
        <Row>
          <Col md={4} className="label">
            {t('serviceDetails.detailsCard.relatesTo')}:
          </Col>
          <Col className="text-break">
            {service.interests.map((interest, ind) => (
              <span key={interest['@id']}>
                {interest.name}
                {ind < service.interests.length - 1 &&
                  t('serviceDetails.detailsCard.listSeparator')}
              </span>
            ))}
          </Col>
        </Row>
      )}
    </Card>
  );
}

DetailsCard.propTypes = {
  service: PropTypes.object.isRequired
};
