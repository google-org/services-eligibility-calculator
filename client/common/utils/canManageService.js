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

import getAllOwners from './getAllOwners';
import hasRole from './hasRole';

/**
 * Returns true if the logged in user has permission to manage
 * this service.
 */
export default function canManageService(loggedInUser, service) {
  if (hasRole(loggedInUser, 'ROLE_ADMIN')) {
    return true;
  }

  if (loggedInUser && service) {
    const username = loggedInUser.username.toLowerCase();
    const mail = loggedInUser.mail && loggedInUser.mail.toLowerCase();
    const mailUsername = mail && mail.slice(0, mail.lastIndexOf('@'));
    const owners = getAllOwners(service);
    if (
      owners &&
      owners.find(owner => owner === username || owner === mailUsername)
    ) {
      return true;
    }
  }

  return false;
}
