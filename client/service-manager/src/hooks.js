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

import { useCallback, useEffect, useState } from 'react';

import { fetch } from './common/dataAccess';
import { getTranslationGetRequests } from './translationRequests';
import { locales } from './Locales';
import { load as opentype_load } from 'opentype.js';

function catch404(error, handle404) {
  if (
    error.message === 'Not Found' &&
    handle404 &&
    typeof handle404 === 'function'
  ) {
    handle404();
  } else {
    throw error;
  }
}

export function useEntity(url, handle404 = null) {
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    url &&
      fetch(url)
        .then(response => response.json().then(setEntity))
        .catch(e => {
          catch404(e, handle404);
        });
  }, [url, handle404]);

  return entity;
}

export const useDraft = useEntity;
export const useService = useEntity;
export const useInterest = useEntity;
export const useDepartment = useEntity;
export const useHistoryVersion = useEntity;

export function useEntities(fetchUrl) {
  const [entities, setEntities] = useState(null);

  let fetchEntities = useCallback(
    () =>
      fetch(fetchUrl)
        .then(response => response.json())
        .then(json => setEntities(json && json['hydra:member'])),
    [fetchUrl]
  );

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return [entities, fetchEntities];
}

export function useDrafts() {
  const [drafts, fetchDrafts] = useEntities('service_drafts?pagination=false');
  return { drafts, fetchDrafts };
}

export function useServices() {
  const [services, fetchServices] = useEntities(
    'services?pagination=false&exists[archivedDateTime]=false'
  );
  return { services, fetchServices };
}

export function useArchivedServices() {
  const [archivedServices, fetchArchivedServices] = useEntities(
    'services?pagination=false&exists[archivedDateTime]=true'
  );
  return { archivedServices, fetchArchivedServices };
}

export function useInterests() {
  const [interests, fetchInterests] = useEntities('interests?pagination=false');
  if (interests) {
    let otherIndex = interests.findIndex(interest => interest.name === 'Other');
    if (otherIndex >= 0) {
      interests.push(interests.splice(otherIndex, 1)[0]);
    }
  }
  return { interests, fetchInterests };
}

export function useTranslatedEntities(uri, disableTranslationFallback = false) {
  const [entities, setEntities] = useState(null);

  let fetchEntities = useCallback(
    () =>
      Promise.all(
        getTranslationGetRequests(uri, disableTranslationFallback)
      ).then(values => {
        const valueMap = {};
        locales.forEach(
          (loc, index) => (valueMap[loc.locale] = values[index]['hydra:member'])
        );
        setEntities(valueMap);
      }),
    [uri, disableTranslationFallback]
  );

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  return [entities, fetchEntities];
}

export function useTranslatedInterests() {
  const [interests, fetchInterests] = useTranslatedEntities('/api/interests');
  return { interests, fetchInterests };
}
export function useTranslatedDepartments() {
  const [departments, fetchDepartments] = useTranslatedEntities(
    '/api/departments'
  );
  return { departments, fetchDepartments };
}

export function useDepartments() {
  const [departments, fetchDepartments] = useEntities(
    'departments?pagination=false'
  );
  if (departments) {
    let otherIndex = departments.findIndex(
      department => department.name === 'Other'
    );
    if (otherIndex >= 0) {
      departments.push(departments.splice(otherIndex, 1)[0]);
    }
  }
  return { departments, fetchDepartments };
}

export function useSettings() {
  const [rawSettings] = useEntities('settings?pagination=false');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    rawSettings &&
      setSettings(
        rawSettings.reduce((result, item) => {
          try {
            result[item.name] = JSON.parse(item.value);
          } catch (e) {
            result[item.name] = item.value;
          }
          return result;
        }, {})
      );
  }, [rawSettings]);

  return { settings, setSettings };
}

export function useEntityTranslations(
  url,
  handle404,
  disableTranslationFallback = false
) {
  const [translations, setTranslations] = useState({});
  useEffect(() => {
    if (url) {
      Promise.all(getTranslationGetRequests(url, disableTranslationFallback))
        .then(values => {
          const valueMap = {};
          locales.forEach(
            (loc, index) => (valueMap[loc.locale] = values[index])
          );
          setTranslations(valueMap);
        })
        .catch(e => {
          catch404(e, handle404);
        });
    } else {
      const emptyMap = {};
      locales.forEach(loc => (emptyMap[loc.locale] = {}));
      setTranslations(emptyMap);
    }
  }, [url, handle404, disableTranslationFallback]);
  return translations;
}

export const useDepartmentTranslations = useEntityTranslations;
export const useInterestTranslations = useEntityTranslations;
export const useServiceTranslations = useEntityTranslations;

export function useServiceActivity() {
  const [activities] = useEntities('service_activities?pagination=false');
  return { activities };
}

export function useUserActivity() {
  const [activities] = useEntities('user_activities?pagination=false');
  return { activities };
}

export function useAnalytics(serviceId) {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    serviceId &&
      fetch('services/' + serviceId + '/analytics')
        .then(response => response.json().then(setAnalytics))
        .catch(e => {
          console.log('Error retrieving analytics: ' + e);
          setAnalytics({ metrics: [] });
        });
  }, [serviceId]);

  return analytics;
}

export function useMaterialIcons(
  url = 'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.woff'
) {
  // NOTE: The font URL was determined by running:
  //  curl -s 'https://fonts.googleapis.com/icon?family=Material+Icons' \
  //    -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:10.0) Gecko/20100101 Firefox/10.0"
  // A Firefox User-Agent is used because that returns a 'woff' file, which is
  // smaller than the default 'ttf' file. A Chrome User-Agent returns an even
  // smaller 'woff2' file, but that format isn't supported by opentype.js.
  const [materialIcons, setMaterialIcons] = useState();
  useEffect(() => {
    // Ligature lookup based on example code in:
    // https://github.com/opentypejs/opentype.js/issues/384
    opentype_load(url, function(err, font) {
      var iconNames = new Set();
      var glyphIndexMap = font.tables.cmap.glyphIndexMap;
      var reverseGlyphIndexMap = {};
      Object.keys(glyphIndexMap).forEach(function(key) {
        var value = glyphIndexMap[key];
        reverseGlyphIndexMap[value] = key;
      });

      font.tables.gsub.lookups.forEach(function(lookup) {
        lookup.subtables.forEach(function(subtable) {
          subtable.ligatureSets.forEach(function(set, i) {
            set.forEach(function(ligature) {
              var coverage2 = [];
              subtable.coverage.ranges.forEach(function(coverage) {
                for (let i = coverage.start; i <= coverage.end; i++) {
                  let character = reverseGlyphIndexMap[i];
                  character = parseInt(character);
                  coverage2.push(String.fromCharCode(character));
                }
              });

              var components = ligature.components.map(function(component) {
                component = reverseGlyphIndexMap[component];
                component = parseInt(component);
                return String.fromCharCode(component);
              });
              var name = coverage2[i] + components.join('');
              iconNames.add(name);
            });
          });
        });
      });
      setMaterialIcons(Array.from(iconNames).sort());
    });
  }, [url]);

  return materialIcons;
}
