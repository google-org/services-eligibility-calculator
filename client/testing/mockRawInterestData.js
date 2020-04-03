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

export const interests = {
  '@context': '/api/contexts/Interest',
  '@id': '/api/interests',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/interests/0',
      '@type': 'Interest',
      name: 'Animals',
      materialIcon: 'pets'
    },
    {
      '@id': '/api/interests/1',
      '@type': 'Interest',
      name: 'Childcare',
      materialIcon: 'child_friendly'
    },
    {
      '@id': '/api/interests/2',
      '@type': 'Interest',
      name: 'Energy',
      materialIcon: 'nature_people'
    },
    {
      '@id': '/api/interests/3',
      '@type': 'Interest',
      name: 'Food',
      materialIcon: 'fastfood'
    },
    {
      '@id': '/api/interests/4',
      '@type': 'Interest',
      name: 'Housing',
      materialIcon: 'home'
    },
    {
      '@id': '/api/interests/5',
      '@type': 'Interest',
      name: 'Mediation',
      materialIcon: 'forum'
    },
    {
      '@id': '/api/interests/6',
      '@type': 'Interest',
      name: 'Older adults',
      materialIcon: 'person_outline'
    },
    {
      '@id': '/api/interests/7',
      '@type': 'Interest',
      name: 'Wellness',
      materialIcon: 'directions_run'
    }
  ],
  'hydra:totalItems': 8,
  'hydra:view': {
    '@id':
      '/api/interests?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  }
};
