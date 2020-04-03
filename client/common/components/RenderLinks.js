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

export default function RenderLinks({ type, items }) {
  if (Array.isArray(items)) {
    return items.map((item, i) => (
      <div key={i}>
        <RenderLinks type={type} items={item} />
      </div>
    ));
  }

  return (
    // TODO: These "/show/@id" URLs no longer work. Should these links create
    // modal dialogs instead?
    // <Link to={`/${type}/show/${base64URLEncode(items && items['@id'])}`}>
    <>{items && items.name}</>
    // </Link>
  );
}

RenderLinks.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.any
};
