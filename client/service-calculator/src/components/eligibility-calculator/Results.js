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
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Address from './filters/Address';
import { ExternalLink } from '../../common/utils';
import { FilterContext } from '../../App';
import Helmet from 'react-helmet';
import Income from './filters/Income';
import Interests from './filters/Interests';
import People from './filters/People';
import { PrimaryButton } from './PrimaryButton';
import SearchBox from './SearchBox';
import { ServiceCards } from './ServiceCards';
import { TransparentButton } from './TransparentButton';
import queryString from 'query-string';
import { useRecommendedServices } from '../../hooks';
import { useTranslation } from 'react-i18next';

let updateUrlTimeout = undefined;
const clearUpdateUrlTimeout = () => {
  if (updateUrlTimeout) {
    clearTimeout(updateUrlTimeout);
    updateUrlTimeout = undefined;
  }
};

export default function Results({ selectedId }) {
  const history = useHistory();
  const location = useLocation();
  const query = queryString.parse(location.search).q || '';
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    filterState,
    setFilterState,
    resetFilterState,
    lastSearch,
    setLastSearch
  } = useContext(FilterContext);
  const [currentSearchValue, setCurrentSearchValue] = useState(lastSearch);
  const {
    recommendedServices,
    otherServices,
    allServices
  } = useRecommendedServices(filterState, lastSearch);
  const { t, i18n } = useTranslation();
  const filtersRef = useRef(null);

  // Keep the query param and the current search term in sync.
  useEffect(() => {
    if (query !== currentSearchValue) {
      if (initialLoad && query && !currentSearchValue) {
        setCurrentSearchValue(query);
        setLastSearch(query);
      } else {
        let page = location.pathname;
        if (currentSearchValue) {
          page += '?q=' + encodeURIComponent(currentSearchValue);
        }
        if (updateUrlTimeout) {
          clearTimeout(updateUrlTimeout);
        }
        // We update after 1 second to avoid spamming analytics with interim search terms.
        updateUrlTimeout = setTimeout(() => history.replace(page), 1000);
      }
    }

    if (initialLoad) {
      window.onbeforeunload = clearUpdateUrlTimeout;
      setInitialLoad(false);
    }

    return () => {
      clearUpdateUrlTimeout();
      window.onbeforeunload = undefined;
    };
  }, [
    query,
    currentSearchValue,
    initialLoad,
    history,
    location.pathname,
    setLastSearch
  ]);

  return (
    <>
      <Helmet>
        <title>{t('serviceList.pageTitle')}</title>
      </Helmet>
      <Row>
        <Col xs={12}>
          <h1>{t('serviceList.title')}</h1>
          <TransparentButton
            analytics={{
              action: 'Language',
              label: t('serviceList.translateButton')
            }}
            onClick={() =>
              i18n.changeLanguage(i18n.language !== 'en' ? 'en' : 'es')
            }
          >
            {t('serviceList.translateButton')}
          </TransparentButton>
        </Col>
        <Col xs={12}>
          <SearchBox
            onSearch={setLastSearch}
            value={currentSearchValue}
            setValue={setCurrentSearchValue}
            location={location}
          />
        </Col>
        <Col xs={12} className="mb-2 filter-row" ref={filtersRef} tabIndex="-1">
          <People
            people={filterState.people}
            setPeople={people =>
              setFilterState({
                ...filterState,
                people
              })
            }
          />
          <Interests
            selectedInterests={filterState.interests}
            setSelectedInterests={selectedInterests =>
              setFilterState({
                ...filterState,
                interests: selectedInterests
              })
            }
          />
          <Income
            income={filterState.income}
            setIncome={income =>
              setFilterState({
                ...filterState,
                income
              })
            }
          />
          <Address
            resident={filterState.resident}
            setResident={resident =>
              setFilterState({
                ...filterState,
                resident
              })
            }
          />
        </Col>
        {(recommendedServices || otherServices) && (
          <Col xs={12}>
            <TransparentButton
              analytics={{
                action: 'Clear',
                label: t('serviceList.clearSelectionsButton')
              }}
              onClick={() => {
                resetFilterState();
                setLastSearch('');
                setCurrentSearchValue('');
                filtersRef.current && filtersRef.current.focus();
              }}
            >
              {t('serviceList.clearSelectionsButton')}
            </TransparentButton>
          </Col>
        )}
      </Row>
      {!recommendedServices && !otherServices && !allServices && (
        <div role="status">
          <h2>{t('loading')}</h2>
        </div>
      )}
      {recommendedServices && (
        <Row className="service-list" data-testid="service-list-recommended">
          <Col xs={12}>
            <h2>
              {t('serviceList.recommendedWithCount', {
                count: recommendedServices.length
              })}
            </h2>
          </Col>
          <Col xs={12} className="no-results">
            {recommendedServices.length >= 0 && (
              <ServiceCards
                services={recommendedServices}
                selectedId={selectedId}
              />
            )}
            {recommendedServices.length === 0 && (
              <>
                <div className="w-100 mt-4 no-results-header">
                  {t('serviceList.noResults')}
                </div>
                <div className="w-100 clear-selections-description">
                  {t('serviceList.clearSelectionsDescription')}
                </div>
                <div className="mt-2 mb-2">
                  <span aria-hidden="true">
                    {t('serviceList.infoPreText')}{' '}
                  </span>
                  <ExternalLink
                    action="CityWebsite"
                    url={t('serviceList.linkToCityWebsiteInfoBox')}
                    ariaLabel={
                      t('serviceList.infoPreText') +
                      ' ' +
                      t('serviceList.linkToCityWebsiteInfoBoxText') +
                      ' ' +
                      t('serviceList.infoPostText')
                    }
                  >
                    {t('serviceList.linkToCityWebsiteInfoBoxText')}
                  </ExternalLink>
                  <span aria-hidden="true">
                    {' '}
                    {t('serviceList.infoPostText')}
                  </span>
                </div>{' '}
                <PrimaryButton
                  className="mb-4 mt-2"
                  analytics={{
                    action: 'Clear',
                    label: t('serviceList.clearSelectionsButton')
                  }}
                  onClick={() => {
                    resetFilterState();
                    setLastSearch('');
                    setCurrentSearchValue('');
                    filtersRef.current && filtersRef.current.focus();
                  }}
                >
                  {t('serviceList.clearSelectionsButton')}
                </PrimaryButton>
              </>
            )}
          </Col>
        </Row>
      )}
      {otherServices && (
        <Row className="service-list" data-testid="service-list-other">
          <Col xs={12}>
            <h2>
              {t('serviceList.otherWithCount', {
                count: otherServices.length
              })}
            </h2>
          </Col>
          <Col xs={12}>
            <ServiceCards services={otherServices} selectedId={selectedId} />
          </Col>
        </Row>
      )}
      {allServices && (
        <Row className="service-list" data-testid="service-list-all">
          <Col xs={12}>
            <h2>
              {t('serviceList.allWithCount', {
                count: allServices.length
              })}
            </h2>
          </Col>
          <Col xs={12}>
            <ServiceCards services={allServices} selectedId={selectedId} />
          </Col>
        </Row>
      )}
    </>
  );
}
