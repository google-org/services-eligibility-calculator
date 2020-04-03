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
import SanitizedHTML from 'react-sanitized-html';
import { logAnalytics } from '../../../utils/ExternalLink';

export const ALLOWED_TAGS = [
  'a',
  'p',
  'sup',
  'sub',
  'del',
  'strong',
  'em',
  'ins',
  'ul',
  'ol',
  'li'
];

export const ALLOWED_ATTRIBUTES = {
  a: ['href', 'target', 'rel', 'onauxclick', 'onclick']
};

global.___handleHtmlTextClick = url => {
  logAnalytics('EmbeddedLink', url);
};

export const TRANSFORM_TAGS = {
  a: function(tagName, attribs) {
    return {
      tagName: tagName,
      attribs: {
        target: '_blank',
        rel: 'noopener noreferrer',
        href: attribs.href,
        onauxclick: '___handleHtmlTextClick("' + attribs.href + '")',
        onclick: '___handleHtmlTextClick("' + attribs.href + '")'
      }
    };
  }
};

export default function HtmlText({ html }) {
  return (
    <SanitizedHTML
      allowedTags={ALLOWED_TAGS}
      allowedAttributes={ALLOWED_ATTRIBUTES}
      transformTags={TRANSFORM_TAGS}
      html={html}
    />
  );
}

HtmlText.propTypes = {
  html: PropTypes.string.isRequired
};
