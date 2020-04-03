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

import { fetch } from './dataAccess';
import jwt_decode from 'jwt-decode';

export function login(username, password) {
  return fetch('login', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password
    })
  }).then(handleTokenResponse);
}

export function refreshToken() {
  const refresh_token = localStorage.getItem('refresh_token');
  if (
    refresh_token !== null &&
    jwtWillExpireWithinSeconds(300 /* five minutes */)
  ) {
    return fetch('token/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token
      })
    }).then(handleTokenResponse);
  }
}

function handleTokenResponse(response) {
  return response.json().then(json => {
    if (!json.token) {
      return false;
    }
    localStorage.setItem('jwt_token', json.token);
    if (json.refresh_token) {
      localStorage.setItem('refresh_token', json.refresh_token);
    } else {
      localStorage.removeItem('refresh_token');
    }
    return true;
  });
}

function jwtWillExpireWithinSeconds(seconds) {
  let encodedToken = localStorage.getItem('jwt_token');
  if (encodedToken != null) {
    let token = jwt_decode(encodedToken);
    return token.exp <= Math.floor(Date.now() / 1000) + seconds;
  }
  return false;
}

export function logout() {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('refresh_token');
}

export function isLoggedIn() {
  return getEncodedJwtToken() != null;
}

export function getEncodedJwtToken() {
  let encodedToken = localStorage.getItem('jwt_token');
  if (encodedToken != null) {
    let token = jwt_decode(encodedToken);
    if (token.exp <= Math.floor(Date.now() / 1000)) {
      localStorage.removeItem('jwt_token');
      encodedToken = null;
    }
  }
  return encodedToken;
}

export function getMillisUntilExpiration() {
  let encodedToken = getEncodedJwtToken();
  if (encodedToken != null) {
    let expiration = jwt_decode(encodedToken).exp * 1000;
    return expiration - Date.now();
  } else {
    return null;
  }
}

export function getLoggedInUser() {
  let encodedToken = getEncodedJwtToken();
  if (encodedToken != null) {
    return jwt_decode(encodedToken);
  } else {
    return {
      roles: [],
      username: '',
      displayName: '',
      mail: '',
      thumbnailPhoto: ''
    };
  }
}
