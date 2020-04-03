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

import './ActionModal.css';

import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import ReactGA from 'react-ga';

export default function ActionModal(props) {
  const onCancel = () => {
    ReactGA.event({
      category: 'Action',
      action: props.cancelText,
      label: props.analyticsLabel || props.title
    });
    props.onCancel();
  };
  const onAction = () => {
    ReactGA.event({
      category: 'Action',
      action: props.actionText,
      label: props.analyticsLabel || props.title
    });
    props.onAction();
  };
  const renderBody = footer => {
    if (props.renderBody) {
      return props.renderBody(footer);
    } else {
      return footer;
    }
  };
  return (
    <Modal className="action-modal" show={true} onHide={props.onCancel}>
      {props.title && (
        <Modal.Header className="header">
          <h2>{props.title}</h2>
        </Modal.Header>
      )}
      <Modal.Body>
        {renderBody(
          <>
            {props.children}
            <div className="float-right">
              {props.onCancel && props.cancelText && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-blue-text"
                >
                  {props.cancelText}
                </button>
              )}
              <button className="btn btn-primary" onClick={onAction}>
                {props.actionText}
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
}

ActionModal.propTypes = {
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  actionText: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
  analyticsLabel: PropTypes.string
};
