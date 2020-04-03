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
import { useDepartment } from '../../hooks';

export default function Remove(props) {
  const department = useDepartment(base64URLDecode(props.departmentId));

  const deleteDepartment = department => {
    fetch(department['@id'], { method: 'DELETE' })
      .then(() => {
        props.onRemove();
      })
      .catch(() => {
        window.alert(
          'Failed to remove:\n\t' +
            department.name +
            '\n\nThe department is probably referenced by one or more services.'
        );
        props.onCancel();
      });
  };

  return (
    <Modal show={true} onHide={props.onCancel}>
      <Modal.Body>
        <>
          {department && (
            <>
              <div className="container header">
                <h2>Remove {department.name}?</h2>
              </div>
              <div className="container body">
                If you remove this department, it will no longer be available to
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
                  {department && (
                    <button
                      className="btn btn-blue-text"
                      onClick={() => deleteDepartment(department)}
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
  departmentId: PropTypes.string,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func
};
