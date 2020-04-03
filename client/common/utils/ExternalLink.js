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

import PropTypes from 'prop-types';
import React from 'react';
import ReactGA from 'react-ga';

export const logAnalytics = (action, url) =>
  action &&
  ReactGA.event({
    category: 'Click',
    action: action,
    label: url.startsWith('mailto') ? url.replace('@', '%40') : url
  });

/**
 * Render an external link, and log an analytics event with the specified
 * action if set.
 */
export default function ExternalLink(props) {
  return (
    props.url && (
      <a
        className={props.className}
        href={
          (props.url.startsWith('http') ||
          props.url.startsWith('mailto:') ||
          props.url.startsWith('tel:') ||
          props.url.startsWith('sms:')
            ? ''
            : 'http://') + props.url
        }
        target="_blank"
        rel="noopener noreferrer"
        onAuxClick={() => {
          logAnalytics(props.action, props.url);
        }}
        onClick={() => {
          logAnalytics(props.action, props.url);
        }}
        aria-label={props.ariaLabel}
      >
        {props.children ? props.children : props.url}
      </a>
    )
  );
}

ExternalLink.propTypes = {
  action: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  url: PropTypes.string
};
