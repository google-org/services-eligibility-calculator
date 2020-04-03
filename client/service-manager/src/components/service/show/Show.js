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

import '../../../common/components/service/show/Show.css';

import { AuthContext, SettingsContext } from '../../../App';
import { Col, Row } from 'react-bootstrap';
import React, { useContext, useEffect, useState } from 'react';
import {
  SERVICE_TYPE_ARCHIVED,
  SERVICE_TYPE_DRAFT,
  SERVICE_TYPE_HISTORY_VERSION,
  SERVICE_TYPE_PUBLISHED
} from '../../../common/utils/serviceTypes';
import { defaultLocale, locales } from '../../../Locales';

import AnalyticsCard from '../AnalyticsCard';
import ApplicationCard from '../../../common/components/service/show/ApplicationCard';
import { BASEPATH } from '../../../common/config';
import DetailsCard from '../../../common/components/service/show/DetailsCard';
import EligibilityCard from '../../../common/components/service/show/EligibilityCard';
import HistoryCard from '../HistoryCard';
import LanguageButtons from '../LanguageButtons';
import { Link } from 'react-router-dom';
import OverviewCard from '../../../common/components/service/show/OverviewCard';
import PropTypes from 'prop-types';
import Remove from '../Remove';
import ServiceOwnerCard from '../ServiceOwnerCard';
import Share from '../Share';
import StickyHeader from '../StickyHeader';
import { ToastContext } from '../../../App';
import { base64URLEncode } from '../../../common/base64URL';
import { getAllOwners } from '../../../common/utils';
import { useTranslation } from 'react-i18next';

/**
 * Displays information for a service.
 */
export default function Show({
  history,
  fromSettings,
  entityType,
  entityUrl,
  translations,
  serviceId,
  serviceHistory,
  editLink,
  locale,
  canManageService,
  onPublish
}) {
  const { settings } = useContext(SettingsContext);
  const [currentLocale, setCurrentLocale] = useState(locale || defaultLocale);
  const [entity, setEntity] = useState(translations[defaultLocale]);
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(currentLocale);
    setEntity(translations[currentLocale]);
  }, [translations, currentLocale, i18n]);

  const [owners, setOwners] = useState(getAllOwners(entity));
  useEffect(() => {
    setOwners(getAllOwners(entity));
  }, [entity]);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const { setToastMessage } = React.useContext(ToastContext);

  const editLinkInLocale = {
    ...editLink,
    state: { ...editLink.state, locale: currentLocale }
  };

  const renderActionButtons = () => {
    return (
      <>
        {entityType !== SERVICE_TYPE_HISTORY_VERSION &&
          canManageService(loggedInUser, entity) && (
            <div className="float-right">
              {entityType !== SERVICE_TYPE_ARCHIVED && (
                <>
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="btn btn-blue-text"
                  >
                    {entityType === SERVICE_TYPE_DRAFT ? 'Delete' : 'Archive'}
                  </button>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="btn btn-blue-text"
                  >
                    Share
                  </button>
                </>
              )}
              {entityType === SERVICE_TYPE_DRAFT && (
                <>
                  <>
                    <Link
                      to={editLinkInLocale}
                      className="btn btn-blue-text"
                      role="button"
                    >
                      Edit
                    </Link>
                  </>
                  {onPublish && (
                    <button className="btn btn-primary" onClick={onPublish}>
                      Publish
                    </button>
                  )}
                </>
              )}
              {entityType === SERVICE_TYPE_PUBLISHED && (
                <Link
                  to={editLinkInLocale}
                  className="btn btn-primary"
                  role="button"
                >
                  Edit
                </Link>
              )}
              {entityType === SERVICE_TYPE_ARCHIVED && (
                <Link
                  to={editLinkInLocale}
                  className="btn btn-primary"
                  role="button"
                >
                  Restore
                </Link>
              )}
            </div>
          )}
        {entityType === SERVICE_TYPE_HISTORY_VERSION && (
          <div className="float-right">
            {canManageService(loggedInUser, entity) && (
              <Link to={editLinkInLocale}>
                <button className="btn btn-blue-text">Restore</button>
              </Link>
            )}
            <Link
              to={`${BASEPATH}services/show/${base64URLEncode(entity.service)}`}
            >
              <button className="btn btn-primary">Show Current Version</button>
            </Link>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {showRemoveModal && (
        <Remove
          serviceUrl={entityUrl}
          onCancel={() => setShowRemoveModal(false)}
          onRemove={() => {
            setShowRemoveModal(false);
            history.push(`${BASEPATH}services/`);
            setToastMessage(
              entity.name +
                (entityType === SERVICE_TYPE_DRAFT ? ' deleted' : ' archived')
            );
          }}
          draft={entityType === SERVICE_TYPE_DRAFT}
        />
      )}
      {showShareModal && (
        <Share
          serviceUrl={entityUrl}
          serviceName={entity.name}
          onCancel={() => setShowShareModal(false)}
          onShared={sharedWith => {
            setShowShareModal(false);
            setOwners([...owners, sharedWith]);
          }}
        />
      )}
      {entity === undefined && (
        <div className="alert alert-info" role="status">
          Loading...
        </div>
      )}

      {entity && (
        <>
          <StickyHeader
            title={entity.name}
            serviceType={entityType}
            backLink={
              fromSettings
                ? `${BASEPATH}settings/service-activity`
                : `${BASEPATH}services/`
            }
            actionButtons={renderActionButtons()}
          />
          <LanguageButtons
            locales={locales}
            locale={currentLocale}
            onLocaleChange={setCurrentLocale}
          />
          <Row>
            <Col xs={12} md={8} className="px-0 px-md-3">
              <OverviewCard service={entity} />
              <DetailsCard service={entity} />
              <EligibilityCard
                eligibilityProfiles={entity.eligibilityProfiles}
                ami={settings && settings.ami}
                fpl={settings && settings.fpl}
              />
              <ApplicationCard service={entity} />
            </Col>
            <Col xs={12} md={4} className="px-0 px-md-3">
              <ServiceOwnerCard owners={owners} />
              <AnalyticsCard serviceId={serviceId} />
              <HistoryCard
                history={serviceHistory}
                serviceId={serviceId}
                serviceType={entityType}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

Show.propTypes = {
  history: PropTypes.object.isRequired,
  entityType: PropTypes.string.isRequired,
  entityUrl: PropTypes.string.isRequired,
  entity: PropTypes.object,
  serviceId: PropTypes.string,
  serviceHistory: PropTypes.array,
  editLink: PropTypes.object.isRequired,
  locale: PropTypes.string,
  canManageService: PropTypes.func.isRequired,
  onPublish: PropTypes.func
};
