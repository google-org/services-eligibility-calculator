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

export const settings = {
  '@context': '/api/contexts/Setting',
  '@id': '/api/settings',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/settings/ami',
      '@type': 'Setting',
      name: 'ami',
      value: '[79600,90900,102300,113600,122700,131800,140900,150000]'
    },
    {
      '@id': '/api/settings/fpl',
      '@type': 'Setting',
      name: 'fpl',
      value: '[12490,16910,21330,25750,30170,34590,39010,43430]'
    },
    {
      '@id': '/api/settings/infoBanner',
      '@type': 'Setting',
      name: 'infoBanner',
      value: 'This is a test info banner!'
    }
  ],
  'hydra:totalItems': 3,
  'hydra:view': {
    '@id':
      '/api/settings?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  }
};
