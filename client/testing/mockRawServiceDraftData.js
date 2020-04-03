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

export const service_drafts = {
  '@context': '/api/contexts/ServiceDraft',
  '@id': '/api/service_drafts',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/service_drafts/1',
      '@type': 'ServiceDraft',
      service: {
        '@id': '/api/services/15',
        '@type': 'Service',
        history: [],
        shares: [],
        numEdits: 0
      },
      eligibilityProfiles: [],
      createdBy: 'guest1',
      shares: [
        {
          '@id': '/api/service_draft_shares/2',
          '@type': 'ServiceDraftShare',
          sharedWithUsername: 'user',
          sharedByUsername: 'guest1',
          sharedByDisplayName: 'Guest One'
        }
      ],
      name: 'A New Draft',
      description: 'Edited description.',
      details: null,
      alwaysAcceptApplications: true,
      department: {
        '@id': '/api/departments/10',
        '@type': 'Department',
        name: 'Housing and Human Services'
      },
      applicationWindowStart: null,
      applicationWindowEnd: null,
      interests: [
        {
          '@id': '/api/interests/1',
          '@type': 'Interest',
          name: 'Childcare',
          materialIcon: 'child_friendly'
        }
      ],
      applicationAddress: '909 Arapahoe Avenue, Boulder, CO',
      applicationHours: null,
      applicationPhone: null,
      applicationPhoneOther: null,
      contactEmail: 'newservice@domain.com',
      applicationOnline:
        'https://bouldercolorado.gov/seniors/food-tax-rebate-program',
      applicationWebAddresses: [],
      applicationDocuments: 'Proof of age',
      lastModifiedDateTime: null,
      lastModifiedBy: null,
      lastModifiedByDisplayName: null,
      numEdits: 1,
      lastModifiedAgo: ''
    },
    {
      '@id': '/api/service_drafts/2',
      '@type': 'ServiceDraft',
      service: null,
      eligibilityProfiles: [
        {
          '@id': '/api/service_draft_eligibilities/0',
          '@type': 'ServiceDraftEligibility',
          profileIndex: 0,
          ageMin: null,
          ageMax: 76,
          percentAMI: null,
          percentFPL: 99,
          incomeMaxima: [],
          fees: 'Illum repellat placeat accusantium natus.',
          residentRequired: true,
          citizenRequired: true,
          other: 'Qui reprehenderit repellendus porro est omnis.'
        }
      ],
      createdBy: 'user',
      shares: [
        {
          '@id': '/api/service_draft_shares/1',
          '@type': 'ServiceDraftShare',
          sharedWithUsername: 'guest1',
          sharedByUsername: 'user',
          sharedByDisplayName: 'Display Name'
        }
      ],
      name: 'Draft for New Service',
      description: 'Draft for New Service',
      details: 'Some additional details.',
      alwaysAcceptApplications: false,
      department: {
        '@id': '/api/departments/10',
        '@type': 'Department',
        name: 'Housing and Human Services'
      },
      applicationWindowStart: '2020-01-01T00:00:00+00:00',
      applicationWindowEnd: '2020-12-31T00:00:00+00:00',
      interests: [
        {
          '@id': '/api/interests/2',
          '@type': 'Interest',
          name: 'Energy',
          materialIcon: 'nature_people'
        },
        {
          '@id': '/api/interests/5',
          '@type': 'Interest',
          name: 'Mediation',
          materialIcon: 'forum'
        }
      ],
      applicationAddress: 'Boulder, CO',
      applicationHours: null,
      applicationPhone: '555-555-5555',
      applicationPhoneOther: 'ext 5555',
      contactEmail: 'frontdesk@domain.com',
      applicationOnline: 'https://bouldercolorado.gov/',
      applicationWebAddresses: ['https://bouldercolorado.gov/'],
      applicationDocuments: null,
      lastModifiedDateTime: '2011-08-04T14:07:31+00:00',
      lastModifiedBy: 'user',
      lastModifiedByDisplayName: 'User',
      numEdits: 1,
      lastModifiedAgo: '20 days ago'
    }
  ],
  'hydra:totalItems': 2,
  'hydra:view': {
    '@id':
      '/api/service_drafts?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  },
  'hydra:search': {
    '@type': 'hydra:IriTemplate',
    'hydra:template':
      '/api/service_drafts{?order[name],order[description],order[lastModifiedBy],order[lastModifiedDateTime]}',
    'hydra:variableRepresentation': 'BasicRepresentation',
    'hydra:mapping': [
      {
        '@type': 'IriTemplateMapping',
        variable: 'order[name]',
        property: 'name',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'order[description]',
        property: 'description',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'order[lastModifiedBy]',
        property: 'lastModifiedBy',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'order[lastModifiedDateTime]',
        property: 'lastModifiedDateTime',
        required: false
      }
    ]
  }
};
