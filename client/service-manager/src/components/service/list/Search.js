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

export default function SearchBar({ onSearch }) {
  const searchChangeHandler = event =>
    event.target.value.length > 2 ? onSearch(event.target.value) : onSearch('');

  const searchKeyUpHandler = event =>
    event.key === 'Enter' && onSearch(event.target.value);

  return (
    <div className="input-group search float-right">
      <div className="input-group-prepend">
        <label htmlFor="search-input">
          <span className="input-group-text" aria-hidden="true">
            <i className="material-icons">search</i>
          </span>
        </label>
      </div>
      <input
        type="text"
        onChange={searchChangeHandler}
        onKeyUp={searchKeyUpHandler}
        className="form-control"
        placeholder="Search"
        aria-label="Search"
        id="search-input"
      />
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export const fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.3,
  location: 0,
  distance: 1000,
  maxPatternLength: 128,
  minMatchCharLength: 3,
  keys: [
    'name',
    'department.name',
    'lastModifiedByDisplayName',
    'archivedByDisplayName'
  ]
};

/** Bolds the text matching the search query. */
export const SearchableText = ({ text, match }) => {
  if (!text || text.length === 0) {
    return '';
  }

  const indices = (match && match.indices) || [];
  let currentIndex = 0;
  let output = [];
  for (var i = 0; i < indices.length; i++) {
    output.push(
      <span key={'unmatched_' + i}>
        {text.substring(currentIndex, indices[i][0])}
      </span>
    );
    output.push(
      <span key={'matched' + i} className="search-match">
        {text.substring(indices[i][0], indices[i][1] + 1)}
      </span>
    );
    currentIndex = indices[i][1] + 1;
  }
  output.push(
    <span key={'unmatched_last'}>{text.substring(currentIndex)}</span>
  );

  return output;
};

SearchableText.propTypes = {
  text: PropTypes.string,
  match: PropTypes.object
};
