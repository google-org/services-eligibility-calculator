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

export const departments = {
  '@context': '/api/contexts/Department',
  '@id': '/api/departments',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/departments/0',
      '@type': 'Department',
      name: 'City Attorney'
    },
    {
      '@id': '/api/departments/1',
      '@type': 'Department',
      name: "City Clerk's Office"
    },
    {
      '@id': '/api/departments/2',
      '@type': 'Department',
      name: 'City Council'
    },
    {
      '@id': '/api/departments/3',
      '@type': 'Department',
      name: "City Manager's Office"
    },
    {
      '@id': '/api/departments/4',
      '@type': 'Department',
      name: 'Climate Initiatives'
    },
    {
      '@id': '/api/departments/5',
      '@type': 'Department',
      name: 'Communication'
    },
    {
      '@id': '/api/departments/6',
      '@type': 'Department',
      name: 'Community Vitality'
    },
    {
      '@id': '/api/departments/7',
      '@type': 'Department',
      name: 'Energy Strategy'
    },
    { '@id': '/api/departments/8', '@type': 'Department', name: 'Finance' },
    { '@id': '/api/departments/9', '@type': 'Department', name: 'Fire' },
    {
      '@id': '/api/departments/10',
      '@type': 'Department',
      name: 'Housing and Human Services'
    },
    {
      '@id': '/api/departments/11',
      '@type': 'Department',
      name: 'Human Resources'
    },
    {
      '@id': '/api/departments/12',
      '@type': 'Department',
      name: 'Innovation and Technology'
    },
    {
      '@id': '/api/departments/13',
      '@type': 'Department',
      name: 'Library and Arts'
    },
    {
      '@id': '/api/departments/14',
      '@type': 'Department',
      name: 'Municipal Court'
    },
    { '@id': '/api/departments/15', '@type': 'Department', name: 'OSMP' },
    { '@id': '/api/departments/16', '@type': 'Department', name: 'Other' },
    {
      '@id': '/api/departments/17',
      '@type': 'Department',
      name: 'Parks and Recreation'
    },
    { '@id': '/api/departments/18', '@type': 'Department', name: 'Planning' },
    { '@id': '/api/departments/19', '@type': 'Department', name: 'Police' },
    {
      '@id': '/api/departments/20',
      '@type': 'Department',
      name: 'Public Works'
    }
  ],
  'hydra:totalItems': 21,
  'hydra:view': {
    '@id':
      '/api/departments?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  }
};
