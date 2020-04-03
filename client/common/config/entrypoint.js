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

const ENTRYBASE =
  process.env.NODE_ENV === 'development' || typeof window === 'undefined'
    ? process.env.REACT_APP_API_BACKEND === 'drupal'
      ? // Drupal
        'http://localhost:8080'
      : // API-Platform
        'http://localhost:8000'
    : window.location.origin;
export const ENTRYPOINT =
  ENTRYBASE +
  (typeof process.env.REACT_APP_API_ENDPONT === 'undefined'
    ? '/api/'
    : process.env.REACT_APP_API_ENDPONT);
