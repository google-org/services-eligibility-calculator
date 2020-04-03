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

export const service_histories = {
  '@context': '/api/contexts/ServiceHistory',
  '@id': '/api/service_histories',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/service_histories/0',
      '@type': 'ServiceHistory',
      service: '/api/services/16',
      revision: 2,
      eligibilityProfiles: [],
      shares: [],
      name: 'Senior Center Fitness Discounts',
      description:
        'Animi cupiditate sit reprehenderit quia esse aut delectus omnis vel nobis ut.',
      details:
        'Ea facere architecto aspernatur. Voluptatem dignissimos et voluptas illum sequi. Officiis voluptatem qui temporibus laudantium at eveniet. Aperiam fugiat asperiores cupiditate enim enim odit.',
      alwaysAcceptApplications: true,
      department: {
        '@id': '/api/departments/9',
        '@type': 'Department',
        name: 'Fire'
      },
      applicationWindowStart: '2020-03-12T00:00:00+00:00',
      applicationWindowEnd: '2020-07-29T00:00:00+00:00',
      interests: [
        {
          '@id': '/api/interests/1',
          '@type': 'Interest',
          name: 'Childcare',
          materialIcon: 'child_friendly'
        }
      ],
      applicationAddress: '1868 McKenzie Radial, East Annetown, RI 29644-9957',
      applicationHours:
        'Recusandae voluptas repellat adipisci in est eius temporibus at officia voluptatem temporibus.',
      applicationPhone: '516.894.8014',
      applicationPhoneOther: null,
      contactEmail: 'bridgette.oberbrunner@gmail.com',
      applicationOnline:
        'http://schroeder.net/aut-et-omnis-magnam-eligendi-ea-eos-id.html',
      applicationWebAddresses: ['http://www.waters.com/rerum-quia-quia-qui-ut'],
      applicationDocuments:
        'Voluptates ducimus officiis porro. Repudiandae eos beatae illum magni est unde quibusdam.',
      lastModifiedDateTime: '2019-10-12T00:00:00+00:00',
      lastModifiedBy: 'user',
      lastModifiedByDisplayName: 'Ms. Astrid Ullrich II',
      lastModifiedAgo: '20 days ago'
    }
  ],
  'hydra:totalItems': 1,
  'hydra:view': {
    '@id':
      '/api/service_histories?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  },
  'hydra:search': {
    '@type': 'hydra:IriTemplate',
    'hydra:template':
      '/api/service_histories{?order[name],order[description],order[lastModifiedBy],order[lastModifiedDateTime]}',
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
