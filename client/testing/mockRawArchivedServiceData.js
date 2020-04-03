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

export const services = {
  '@context': '/api/contexts/Service',
  '@id': '/api/services',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/services/19',
      '@type': 'Service',
      eligibilityProfiles: [],
      draft: null,
      history: [],
      archivedDateTime: '2012-10-10T11:14:29+00:00',
      archivedBy: 'doejane',
      archivedByDisplayName: 'Jane Doe',
      shares: [],
      name: 'Aut soluta in.',
      description: 'Illo eum corporis quasi quasi hic qui atque aliquam a.',
      details:
        'Dicta iure repellat et ut. Necessitatibus quae consectetur ut voluptatibus architecto praesentium. Nihil quia tempora nihil eum nam rerum ea odit.',
      alwaysAcceptApplications: false,
      department: {
        '@id': '/api/departments/1',
        '@type': 'Department',
        name: "City Clerk's Office"
      },
      applicationWindowStart: '2020-02-29T00:00:00+00:00',
      applicationWindowEnd: '2020-10-25T00:00:00+00:00',
      interests: [
        {
          '@id': '/api/interests/1',
          '@type': 'Interest',
          name: 'Childcare',
          materialIcon: 'child_friendly'
        }
      ],
      applicationAddress:
        '39932 Bradtke Center Suite 522, North Demond, FL 47688',
      applicationHours:
        'Ea eos aut quidem nulla quidem omnis temporibus eos qui quas corrupti.',
      applicationPhone: '+1 (739) 470-2926',
      applicationPhoneOther: null,
      contactEmail: null,
      applicationOnline: 'http://moore.com/',
      applicationWebAddresses: [
        'http://schiller.biz/fugiat-ad-esse-eius',
        'http://oberbrunner.com/sequi-maiores-quibusdam-quaerat-consequatur-aperiam'
      ],
      applicationDocuments:
        'Quod et amet dolorum aspernatur voluptate est animi. Et possimus tenetur quia assumenda.',
      lastModifiedDateTime: '2015-08-25T01:11:59+00:00',
      lastModifiedBy: 'jovani69',
      lastModifiedByDisplayName: 'Dr. Dangelo Cremin',
      numEdits: 0,
      archivedAgo: '7 years ago',
      lastModifiedAgo: '20 days ago'
    }
  ],
  'hydra:totalItems': 1,
  'hydra:view': {
    '@id':
      '/api/services?exists%5BarchivedDateTime%5D=true&order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  },
  'hydra:search': {
    '@type': 'hydra:IriTemplate',
    'hydra:template':
      '/api/services{?id,id[],name,description,order[name],order[description],order[lastModifiedBy],order[lastModifiedDateTime],exists[archivedDateTime]}',
    'hydra:variableRepresentation': 'BasicRepresentation',
    'hydra:mapping': [
      {
        '@type': 'IriTemplateMapping',
        variable: 'id',
        property: 'id',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'id[]',
        property: 'id',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'name',
        property: 'name',
        required: false
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'description',
        property: 'description',
        required: false
      },
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
      },
      {
        '@type': 'IriTemplateMapping',
        variable: 'exists[archivedDateTime]',
        property: 'archivedDateTime',
        required: false
      }
    ]
  }
};
