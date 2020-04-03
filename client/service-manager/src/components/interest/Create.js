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

import Form from './Form';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { createNamedEntity } from '../namedTranslatedEntity';

export default function Create(props) {
  return (
    <Modal show={true} onHide={props.onCancel} size="xl">
      <Modal.Body>
        <div className="container header">
          <h1>New Interest</h1>
        </div>

        <Form
          onSubmit={values =>
            createNamedEntity('interests', values, props.onCancel)
          }
          onCancel={props.onCancel}
          initialValues={{}}
        />
      </Modal.Body>
    </Modal>
  );
}

Create.propTypes = {
  onCancel: PropTypes.func
};
