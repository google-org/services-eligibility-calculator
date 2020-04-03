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

import React, { useRef } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function SearchBox({ onSearch, value, setValue }) {
  const searchInput = useRef();
  const searchChangeHandler = event => {
    setValue(event.target.value);
    event.target.value.length > 2 ? onSearch(event.target.value) : onSearch('');
  };
  const onSubmitHandler = event => {
    onSearch(searchInput.current.value);
    searchInput.current.blur();
    event.preventDefault();
    return false;
  };
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="input-group search">
        <div className="input-group-prepend">
          <label htmlFor="search-input">
            <span className="input-group-text" aria-hidden="true">
              <i className="material-icons">search</i>
            </span>
          </label>
        </div>
        <input
          type="text"
          className="form-control"
          placeholder={t('serviceList.searchPlaceholder')}
          aria-label={t('serviceList.searchPlaceholder')}
          ref={searchInput}
          value={value}
          onChange={searchChangeHandler}
        />
        {value.length > 0 && (
          <button
            type="button"
            className="btn btn-search-clear"
            onClick={() => {
              setValue('');
              onSearch('');
            }}
          >
            <i
              className="material-icons align-middle"
              aria-label={t('filterModal.clearButton')}
            >
              close
            </i>
          </button>
        )}
      </div>
    </form>
  );
}

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};
