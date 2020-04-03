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

import { Col, Row } from 'react-bootstrap';
import { ExternalLink, MapsLink } from '../../../utils';

import Card from '../Card';
import HtmlText from './HtmlText';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const splitOnNewlines = (text, className) => {
  var paragraphs = text.split('\n');
  return paragraphs.map((paragraph, index) => {
    return (
      <div key={index} className={className}>
        {paragraph}
        {paragraph === '' && <br />}
      </div>
    );
  });
};

/**
 * Displays a row of application information.
 */
function ApplyRow(props) {
  return (
    <Row style={props.style}>
      <Col md={4} className="label">
        {props.icon && (
          <i
            className="material-icons apply-icon align-middle"
            aria-hidden="true"
          >
            {props.icon}
          </i>
        )}
        {props.name && <span className="align-middle">{props.name + ':'}</span>}
      </Col>
      <Col>{props.children}</Col>
    </Row>
  );
}

ApplyRow.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string
};

/**
 * Card used for displaying service application details.
 */
export default function ApplicationCard({ service }) {
  const { t } = useTranslation();
  const applicationWebAddresses = service.applicationWebAddresses.filter(
    url => url && url.length > 0
  );

  return (
    <Card collapsible title={t('serviceDetails.applicationCard.howDoIApply')}>
      <Row>
        <Col md={4} className="label">
          {t('serviceDetails.applicationCard.learnMore')}:
        </Col>
        <Col>
          <ExternalLink
            action="LearnMore_Apply"
            url={service.applicationOnline}
          />
        </Col>
      </Row>
      {service.applicationDocuments && (
        <>
          <hr />
          <div className="instructions">
            {t('serviceDetails.applicationCard.firstYoullNeed')}:
          </div>
          <Row>
            <Col className="text-break">
              <HtmlText html={service.applicationDocuments} />
            </Col>
          </Row>
        </>
      )}
      {(service.applicationPhone ||
        service.applicationPhoneOther ||
        service.contactEmail ||
        service.applicationAddress ||
        service.applicationHours ||
        (applicationWebAddresses && applicationWebAddresses.length > 0)) && (
        <>
          <hr />
          <div className="instructions">
            {t('serviceDetails.applicationCard.whenReadyApply')}:
          </div>
        </>
      )}
      {(service.applicationPhone || service.applicationPhoneOther) && (
        <ApplyRow name={t('serviceDetails.applicationCard.call')} icon="phone">
          {service.applicationPhone && (
            <>
              <ExternalLink
                url={'tel:' + service.applicationPhone}
                action="Call"
              >
                {service.applicationPhone}
              </ExternalLink>{' '}
            </>
          )}
          {service.applicationPhoneOther}
        </ApplyRow>
      )}
      {service.contactEmail && (
        <ApplyRow name={t('serviceDetails.applicationCard.email')} icon="email">
          {service.contactEmail && (
            <ExternalLink
              url={'mailto:' + service.contactEmail}
              action="SendEmail"
            >
              {service.contactEmail}
            </ExternalLink>
          )}
        </ApplyRow>
      )}
      {applicationWebAddresses &&
        applicationWebAddresses.map((url, index) => {
          let props = {};
          if (index === 0) {
            props.name = t('serviceDetails.applicationCard.online');
            props.icon = 'computer';
          }
          if (index !== service.applicationWebAddresses.length - 1) {
            props.style = { marginBottom: 0 };
          }
          return (
            <ApplyRow key={index} {...props}>
              <ExternalLink action="ApplyOnline" url={url} />
            </ApplyRow>
          );
        })}
      {(service.applicationAddress || service.applicationHours) && (
        <ApplyRow
          name={t('serviceDetails.applicationCard.inPerson')}
          icon="directions_walk"
        >
          {service.applicationAddress && (
            <MapsLink query={service.applicationAddress}>
              {splitOnNewlines(service.applicationAddress)}
            </MapsLink>
          )}
          {service.applicationHours && (
            <>
              <br />
              {splitOnNewlines(service.applicationHours)}
            </>
          )}
        </ApplyRow>
      )}
    </Card>
  );
}

ApplicationCard.propTypes = {
  service: PropTypes.object.isRequired
};
