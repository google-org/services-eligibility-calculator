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

export const user_activities = {
  '@context': '/api/contexts/UserActivity',
  '@id': '/api/user_activities',
  '@type': 'hydra:Collection',
  'hydra:member': [
    {
      '@id': '/api/user_activities/admin',
      '@type': 'UserActivity',
      username: 'admin',
      displayName: 'admin',
      numLogins: 2,
      lastLogin: '2020-02-27T20:02:04+00:00',
      numEdits: 0,
      numPublished: 0,
      numArchived: 0
    },
    {
      '@id': '/api/user_activities/guest1',
      '@type': 'UserActivity',
      username: 'guest1',
      displayName: 'guest1',
      numLogins: 0,
      lastLogin: null,
      numEdits: 1,
      numPublished: 0,
      numArchived: 0
    },
    {
      '@id': '/api/user_activities/user',
      '@type': 'UserActivity',
      username: 'user',
      displayName: 'user',
      numLogins: 6,
      lastLogin: '2020-02-27T20:02:04+00:00',
      numEdits: 1,
      numPublished: 1,
      numArchived: 0
    }
  ],
  'hydra:view': {
    '@id':
      '/api/user_activities?order%5Bname%5D=asc&order%5Bdescription%5D=asc&pagination=false',
    '@type': 'hydra:PartialCollectionView'
  }
};
