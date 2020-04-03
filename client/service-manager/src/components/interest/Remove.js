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

import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { base64URLDecode } from '../../common/base64URL';
import { fetch } from '../../common/dataAccess';
import { useInterest } from '../../hooks';

export default function Remove(props) {
  const interest = useInterest(base64URLDecode(props.interestId));

  const deleteInterest = interest => {
    fetch(interest['@id'], { method: 'DELETE' })
      .then(() => {
        props.onRemove();
      })
      .catch(() => {
        window.alert(
          'Failed to remove:\n\t' +
            interest.name +
            '\n\nThe interest is probably referenced by one or more services.'
        );
        props.onCancel();
      });
  };

  return (
    <Modal show={true} onHide={props.onCancel}>
      <Modal.Body>
        <>
          {interest && (
            <>
              <div className="container header">
                <h2>Remove {interest.name}?</h2>
              </div>
              <div className="container body">
                If you remove this interest, it will no longer be available to
                service definitions.
              </div>
              <div className="container">
                <div className="float-right">
                  <button
                    onClick={props.onCancel}
                    className="btn btn-blue-text"
                  >
                    No, cancel
                  </button>
                  {interest && (
                    <button
                      className="btn btn-blue-text"
                      onClick={() => deleteInterest(interest)}
                    >
                      Yes, remove
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      </Modal.Body>
    </Modal>
  );
}

Remove.propTypes = {
  interestId: PropTypes.string,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func
};
