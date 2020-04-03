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

import React, { useState } from 'react';

import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Remove from './Remove';
import { base64URLDecode } from '../../common/base64URL';
import { defaultLocale } from '../../Locales';
import { renderNonDefaultLocales } from '../namedTranslatedEntity';
import { useInterestTranslations } from '../../hooks';

export default function Show(props) {
  const interestTranslations = useInterestTranslations(
    base64URLDecode(props.interestId)
  );
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const interest = interestTranslations[defaultLocale];

  return (
    <>
      {showRemoveModal && (
        <Remove
          interestId={props.interestId}
          onCancel={() => {
            setShowRemoveModal(false);
          }}
          onRemove={() => {
            // Unwind the stack of modals.
            setShowRemoveModal(false);
            props.onCancel();
          }}
        />
      )}
      <Modal size="xl" show={showRemoveModal === false} onHide={props.onCancel}>
        <Modal.Body>
          <h1>Interest: {interest && interest['name']}</h1>
          <>
            {interest === undefined && (
              <div className="alert alert-info" role="status">
                Loading...
              </div>
            )}
            {interest && (
              <table className="table table-responsive">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">name</th>
                    <td>
                      {interest['name']}{' '}
                      {renderNonDefaultLocales('name', interestTranslations)}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">materialIcon</th>
                    <td>
                      <div className="row">
                        <div className="col-1">
                          <i className="material-icons">
                            {interest['materialIcon']}
                          </i>
                        </div>
                        <div className="col">{interest['materialIcon']}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            <div className="float-left">
              <button onClick={props.onCancel} className="btn btn-blue-text">
                Close
              </button>
            </div>
            <div className="float-right">
              <button
                onClick={() => setShowRemoveModal(true)}
                className="btn btn-blue-text"
              >
                Remove
              </button>
              {
                <button onClick={props.onEdit} className="btn btn-blue-text">
                  Edit
                </button>
              }
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
}

Show.propTypes = {
  interestId: PropTypes.string,
  onCancel: PropTypes.func,
  onEdit: PropTypes.func
};
