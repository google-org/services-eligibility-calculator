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

import '../../common/components/service/show/Show.css';

import { Col, Row } from 'react-bootstrap';
import { ExternalLink, sendEmail } from '../../common/utils';
import React, { useContext } from 'react';

import ApplicationCard from '../../common/components/service/show/ApplicationCard';
import { BASEPATH } from '../../common/config';
import { DataContext } from '../../DataContext';
import DetailsCard from '../../common/components/service/show/DetailsCard';
import EligibilityCard from '../../common/components/service/show/EligibilityCard';
import { FilterContext } from '../../App';
import Helmet from 'react-helmet';
import OverviewCard from '../../common/components/service/show/OverviewCard';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { TransparentButton } from '../eligibility-calculator/TransparentButton';
import { base64URLDecode } from '../../common/base64URL';
import { getTotalPeople } from '../../filters/filterAge';
import { useTranslation } from 'react-i18next';

export default function Show(props) {
  const serviceId = base64URLDecode(props.match.params.id);
  const { settings, servicesById } = useContext(DataContext);
  const service = servicesById && servicesById[serviceId];
  const { t } = useTranslation();
  const { filterState, lastSearch } = useContext(FilterContext);

  const shareViaEmail = () => {
    var emailBody = t('serviceDetails.shareViaEmailMessage');
    emailBody += '%0D%0A%0D%0A';
    emailBody += ((service && service.name) || '') + '%0D%0A';
    emailBody += encodeURIComponent(window.location.href);

    var emailSubject = t('serviceDetails.shareViaEmailSubject');
    sendEmail('', emailSubject, emailBody);

    ReactGA.event({
      category: 'Click',
      action: 'Share',
      label: 'Shared by Email'
    });
  };

  let resultsPage = BASEPATH;
  if (lastSearch) {
    resultsPage += '?q=' + encodeURIComponent(lastSearch);
  }

  return (
    <>
      {service === undefined && (
        <div role="status">
          <h2>{t('loading')}</h2>
        </div>
      )}

      {service && (
        <div className="service-details mx-auto">
          <Helmet>
            <title>{service.name}</title>
          </Helmet>
          <Row>
            <Col xs={12} className="mt-3">
              <TransparentButton
                className="d-xl-none"
                onClick={() => props.history.push(resultsPage)}
              >
                <i className="material-icons align-top" aria-hidden="true">
                  arrow_back
                </i>{' '}
                {t('serviceDetails.backButton')}
              </TransparentButton>
              <h1
                id="service-details-name"
                className="mt-1 mb-3 service"
                tabIndex="-1"
              >
                {service.name}
              </h1>
            </Col>
          </Row>
          <Row className="gutter-24">
            <Col xs={12} className="px-0 px-md-4">
              <OverviewCard service={service} hideTitle>
                <Row className="mt-4">
                  <Col xs={6}>
                    <button
                      className="btn btn-share w-100"
                      onClick={() => {
                        if (navigator.share) {
                          navigator
                            .share({
                              title: service.name,
                              text: service.name,
                              url: window.location.href
                            })
                            .then(() => {
                              ReactGA.event({
                                category: 'Click',
                                action: 'Share',
                                label: 'Native Share'
                              });
                            })
                            .catch(e => {
                              if (e.name === 'AbortError') {
                                // User cancelled share.
                                // Don't display sharing modal.
                                ReactGA.event({
                                  category: 'Click',
                                  action: 'Share',
                                  label: 'Cancelled'
                                });
                                return;
                              }
                              shareViaEmail();
                            });
                        } else {
                          shareViaEmail();
                        }
                      }}
                    >
                      {t('serviceDetails.share')}
                    </button>
                  </Col>
                  <Col xs={6}>
                    <ExternalLink
                      action="LearnMore"
                      url={service.applicationOnline}
                      className="btn btn-primary w-100"
                    >
                      {t('serviceDetails.learnMore')}
                    </ExternalLink>
                  </Col>
                </Row>
              </OverviewCard>
              <DetailsCard service={service} />
              <EligibilityCard
                eligibilityProfiles={service.eligibilityProfiles}
                ami={settings && settings.ami}
                fpl={settings && settings.fpl}
                householdSize={getTotalPeople(filterState.people)}
              />
              <ApplicationCard service={service} />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

Show.propTypes = {
  match: PropTypes.object,
  onEdit: PropTypes.func
};
