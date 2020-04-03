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

import { fetch } from './common/dataAccess';

export default { fetchServices, fetchSettings, fetchInterests };

// Entities referenced in these "include fields" will be fully expanded in the
// returned JSON (as opposed to just being links). See also:
// https://www.drupal.org/docs/8/modules/jsonapi/includes
const DEFAULT_INCLUDES =
  'include=field_department,field_interests,field_eligibilityprofiles';

export function fetchServices(locale) {
  // Note: Drupal must enable the "Browser" detection method in
  // admin/config/regional/language/detection to recognize the
  // "Accept-Language" header,
  const headers = new Headers({ 'Accept-Language': locale });
  return fetch('node/service?sort=title&' + DEFAULT_INCLUDES, {
    headers: headers
  }).then(response =>
    response.json().then(data => data && transformServices(data))
  );
}

export function fetchSettings() {
  return fetch('services_manager/services_manager').then(response =>
    response.json().then(data => {
      let rawSettings = data && data['data'];
      return rawSettings.reduce((result, item) => {
        try {
          result[item.attributes.name] = JSON.parse(item.attributes.value);
        } catch (e) {
          result[item.attributes.name] = item.attributes.value;
        }
        return result;
      }, {});
    })
  );
}

function fixApiReference(ref) {
  // It appears that the Drupal JSON:API is always returning "http"-based
  // references, at least when deployed on Heroku, but that causes "mixed
  // content" errors if the calculator is accessed with "https", so force the
  // API URLs to match whatever the calculator URL is using.
  let url = ref;
  if (RegExp('^https://', 'i').test(window.location.href)) {
    url = url.replace(RegExp('^http://', 'i'), 'https://');
  }
  if (url.indexOf('?')) {
    url += '&';
  } else {
    url += '?';
  }
  return url;
}

/*
  Transform service data to the format expected by the UI components (i.e. the
  format returned by the API-Platform backend).
*/
function transformService(service, includes) {
  if (!service) {
    return service;
  }
  let department = null;
  if (service['relationships']['field_department']['data']) {
    department = {};
    department['@id'] =
      service['relationships']['field_department']['data']['id'];
    let department_include = includes.find(
      element => element['id'] === department['@id']
    );
    if (department_include) {
      department['name'] = department_include['attributes']['title'];
    }
  }
  let interests = [];
  (service['relationships']['field_interests']['data'] || []).forEach(function(
    related_interest
  ) {
    let interest = {};
    interest['@id'] = related_interest['id'];
    let interest_include = includes.find(
      element => element['id'] === interest['@id']
    );
    if (interest_include) {
      interest['name'] = interest_include['attributes']['name'];
      interest['materialIcon'] =
        interest_include['attributes']['field_materialicon'];
    }
    interests.push(interest);
  });
  interests.sort(function(a, b) {
    return a['name'].localeCompare(b['name']);
  });
  let eligibility_profiles = [];
  (service['relationships']['field_eligibilityprofiles']['data'] || []).forEach(
    function(related_profile) {
      let profile = {};
      profile['@id'] = related_profile['id'];
      let profile_include = includes.find(
        element => element['id'] === profile['@id']
      );
      if (profile_include) {
        profile['ageMax'] = profile_include['attributes']['field_agemax'];
        profile['ageMin'] = profile_include['attributes']['field_agemin'];
        profile['citizenRequired'] =
          profile_include['attributes']['field_citizenrequired'];
        profile['fees'] = profile_include['attributes']['field_fees'];
        profile['incomeMaxima'] =
          profile_include['attributes']['field_incomemaxima'];
        profile['other'] = profile_include['attributes']['field_other']
          ? profile_include['attributes']['field_other']['processed']
          : '';
        profile['percentAMI'] =
          profile_include['attributes']['field_percentami'];
        profile['percentFPL'] =
          profile_include['attributes']['field_percentfpl'];
        profile['residentRequired'] =
          profile_include['attributes']['field_residentrequired'];
      }
      eligibility_profiles.push(profile);
    }
  );
  const transformed = {
    '@id': fixApiReference(service['links']['self']['href']),
    alwaysAcceptApplications:
      service['attributes']['field_acceptingapplications'],
    applicationAddress: service['attributes']['field_applicationaddress'],
    applicationDocuments: service['attributes']['field_applicationdocuments']
      ? service['attributes']['field_applicationdocuments']['processed']
      : '',
    applicationHours: service['attributes']['field_applicationhours'],
    applicationOnline: service['attributes']['field_applicationonline'],
    applicationPhone: service['attributes']['field_applicationphone'],
    applicationPhoneOther: service['attributes']['field_applicationphoneother'],
    applicationWebAddresses:
      service['attributes']['field_applicationwebaddresses'],
    applicationWindowStart:
      service['attributes']['field_applicationwindowstart'],
    applicationWindowEnd: service['attributes']['field_applicationwindowend'],
    contactEmail: service['attributes']['field_contact'],
    department: department,
    description: service['attributes']['field_description']
      ? service['attributes']['field_description']['processed']
      : '',
    details: service['attributes']['field_details']
      ? service['attributes']['field_details']['processed']
      : '',
    eligibilityProfiles: eligibility_profiles,
    interests: interests,
    lastModifiedDateTime: service['attributes']['changed'],
    name: service['attributes']['title']
  };
  return transformed;
}

function transformServices(services_response) {
  let services = services_response['data'];
  if (!services) {
    return services;
  }
  const transformed = services.map(service =>
    transformService(service, services_response['included'])
  );
  return transformed;
}

export function fetchInterests(locale) {
  const headers = new Headers({ 'Accept-Language': locale });
  return fetch('taxonomy_term/interest?sort=name', {
    headers: headers
  }).then(response =>
    response.json().then(data => data && transformInterests(data))
  );
}

function transformInterests(interests_response) {
  let interests = interests_response['data'];
  if (!interests) {
    return interests;
  }
  let transformed = [];
  for (const item of interests) {
    let interest = {
      '@id': item['id'],
      name: item['attributes']['name'],
      materialIcon: item['attributes']['field_materialicon']
    };
    transformed.push(interest);
  }
  return transformed;
}
