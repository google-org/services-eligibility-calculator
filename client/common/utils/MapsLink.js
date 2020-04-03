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

import ExternalLink from './ExternalLink';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Creates a link to query Google Maps.
 * See https://developers.google.com/maps/documentation/urls/guide for more details.
 */
export default function MapsLink(props) {
  return (
    <ExternalLink
      url={
        'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(props.query)
      }
      action="MapAddress"
    >
      {props.children}
    </ExternalLink>
  );
}

MapsLink.propTypes = {
  query: PropTypes.string.isRequired
};
