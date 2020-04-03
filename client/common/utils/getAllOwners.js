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

/**
 * Returns a list of all the owners of a service.
 */
export default function getAllOwners(service) {
  if (!service) {
    return [];
  }
  let owners = new Set();
  if (service.lastModifiedBy) {
    owners.add(service.lastModifiedBy.toLowerCase());
  }

  if (service.history) {
    service.history.forEach(entry => {
      if (entry.lastModifiedBy) {
        owners.add(entry.lastModifiedBy.toLowerCase());
      }
    });
  }

  let shares = service.shares;
  if (shares) {
    shares.forEach(share => {
      if (share.sharedWithUsername) {
        owners.add(share.sharedWithUsername.toLowerCase());
      }
    });
  }

  if (service.draft) {
    getAllOwners(service.draft).forEach(owner => owners.add(owner));
  }

  if (service.service) {
    getAllOwners(service.service).forEach(owner => owners.add(owner));
  }

  return Array.from(owners);
}
