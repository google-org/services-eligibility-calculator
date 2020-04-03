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

import './Toast.css';

import { Toast as BootstrapToast } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import { ToastContext } from '../App';

export default function Toast(props) {
  const { setToastMessage } = React.useContext(ToastContext);

  return (
    <BootstrapToast
      className="toast"
      show={true}
      autohide
      delay={5000}
      onClose={() => setToastMessage(null)}
    >
      <BootstrapToast.Header closeButton={false}>
        {props.message}
        <button
          className="btn float-right"
          onClick={() => setToastMessage(null)}
        >
          Dismiss
        </button>
      </BootstrapToast.Header>
    </BootstrapToast>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired
};
