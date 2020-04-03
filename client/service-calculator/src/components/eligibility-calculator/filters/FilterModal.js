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

import React from 'react';
import { Modal } from 'react-bootstrap';
import { TransparentButton } from '../TransparentButton';
import { PrimaryButton } from '../PrimaryButton';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function FilterModal({
  title,
  children,
  onClear,
  onApply,
  clearDisabled,
  show,
  onHide,
  className
}) {
  const { t } = useTranslation();

  return (
    <>
      <Modal
        className={className}
        show={show}
        size="md"
        centered
        onHide={onHide}
      >
        <Modal.Header>
          <Modal.Title className="text-center w-100 text-center">
            {title}
            <button
              type="button"
              className="close float-right modal-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onHide}
            >
              <span className="align-middle" aria-hidden="true">
                &times;
              </span>
            </button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <TransparentButton
            className="my-0"
            onClick={onClear}
            disabled={clearDisabled}
          >
            {t('filterModal.clearButton')}
          </TransparentButton>
          <PrimaryButton className="float-right my-0 mx-0" onClick={onApply}>
            {t('filterModal.applyButton')}
          </PrimaryButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}

FilterModal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClear: PropTypes.func,
  onApply: PropTypes.func,
  clearDisabled: PropTypes.bool,
  show: PropTypes.bool,
  onHide: PropTypes.func,
  className: PropTypes.string
};
