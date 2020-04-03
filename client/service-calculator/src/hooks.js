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

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DataContext } from './DataContext';
import Fuse from 'fuse.js';
import ReactGA from 'react-ga';
import backendApiPlatform from './hooks_api_platform';
import backendDrupal from './hooks_drupal';
import { filterAge } from './filters/filterAge';
import { filterIncome } from './filters/filterIncome';
import { filterInterests } from './filters/filterInterests';
import { filterResident } from './filters/filterResident';
import { useTranslation } from 'react-i18next';

const backend =
  process.env.REACT_APP_API_BACKEND === 'drupal'
    ? backendDrupal
    : backendApiPlatform;

export const fuseOptions = {
  id: '@id',
  threshold: 0.3,
  location: 0,
  distance: 1000,
  maxPatternLength: 128,
  minMatchCharLength: 3,
  keys: [
    'name',
    'interests.name',
    'description',
    'details',
    'eligibilityProfiles.other'
  ]
};

function recordFetchEvent(resource) {
  ReactGA.event({
    category: 'Api',
    action: 'Fetch',
    label: resource,
    nonInteraction: true
  });
}

export function useServices() {
  const [services, setServices] = useState(null);
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const servicesById = useMemo(
    () =>
      services &&
      services.reduce((accumulator, currentService) => {
        accumulator[currentService['@id']] = currentService;
        return accumulator;
      }, {}),
    [services]
  );

  let fetchServices = useCallback(locale => {
    recordFetchEvent('services');
    setServices(null);
    backend.fetchServices(locale).then(setServices);
  }, []);

  useEffect(() => {
    fetchServices(locale);
  }, [fetchServices, locale]);

  return { services, servicesById, fetchServices };
}

export function useSettings() {
  const [settings, setSettings] = useState(null);

  let fetchSettings = useCallback(() => {
    recordFetchEvent('settings');
    backend.fetchSettings().then(setSettings);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return settings;
}

export function useInterests() {
  const [interests, setInterests] = useState(null);
  const { i18n } = useTranslation();
  const locale = i18n.language;

  let fetchInterests = useCallback(locale => {
    recordFetchEvent('interests');
    setInterests(null);
    backend.fetchInterests(locale).then(setInterests);
  }, []);

  useEffect(() => {
    fetchInterests(locale);
  }, [fetchInterests, locale]);

  return { interests, fetchInterests };
}

export function filterService(activeFilters, service) {
  // Returns true if any eligibility profile matches
  return service.eligibilityProfiles.some(eligibilityProfile =>
    filterEligibilityProfile(activeFilters, service, eligibilityProfile)
  );
}

export function filterEligibilityProfile(
  activeFilters,
  service,
  eligibilityProfile
) {
  // Returns true iff all active filters match
  return activeFilters.every(filter => filter(service, eligibilityProfile));
}

export function useRecommendedServices(filterState, lastSearch) {
  const { settings, services } = useContext(DataContext);

  const fuseIndex = useMemo(
    () => (services ? new Fuse(services, fuseOptions) : null),
    [services]
  );

  const searchMatches =
    lastSearch.length > 0 && fuseIndex
      ? fuseIndex.search(lastSearch).reduce((accumulator, serviceId) => {
          accumulator[serviceId] = true;
          return accumulator;
        }, {})
      : {};

  const activeFilters = useMemo(
    () =>
      [
        filterInterests(filterState),
        filterAge(filterState),
        filterIncome(filterState, settings),
        filterResident(filterState)
      ].filter(f => !!f),
    [filterState, settings]
  );

  if (!services) {
    return {};
  }

  if (activeFilters.length === 0) {
    if (lastSearch.length === 0) {
      return {
        allServices: services
      };
    }

    return {
      recommendedServices: services.filter(
        service => searchMatches[service['@id']]
      ),
      otherServices: services.filter(service => !searchMatches[service['@id']])
    };
  }

  const result = services.reduce(
    (accumulator, currentService) => {
      (lastSearch.length === 0 || searchMatches[currentService['@id']]) &&
      filterService(activeFilters, currentService)
        ? accumulator.recommendedServices.push(currentService)
        : accumulator.otherServices.push(currentService);
      return accumulator;
    },
    { recommendedServices: [], otherServices: [] }
  );

  return result;
}
