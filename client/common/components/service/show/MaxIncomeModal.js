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

import { Col, Modal, Row } from 'react-bootstrap';

import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function MaxIncomeModal({ show, maxIncomes, onHide }) {
  const { t } = useTranslation();
  return (
    <>
      <Modal
        show={show}
        size="md"
        centered
        onHide={onHide}
        className="max-income"
      >
        <Modal.Body>
          <div className="title">
            {t('serviceDetails.eligibilityCard.maxIncomeModalTitle')}
          </div>
          {maxIncomes &&
            maxIncomes.map((income, ind) => {
              let householdSizeText = t(
                'serviceDetails.eligibilityCard.householdSize',
                {
                  householdSize: ind + 1
                }
              );
              householdSizeText =
                householdSizeText.charAt(0).toUpperCase() +
                householdSizeText.substring(1);
              return (
                <div key={ind}>
                  <Row>
                    <Col>{householdSizeText}</Col>
                    <Col>
                      {'$' +
                        income.toLocaleString(undefined, {
                          maximumFractionDigits: 0
                        })}
                    </Col>
                  </Row>
                  {ind !== maxIncomes.length - 1 && <hr />}
                </div>
              );
            })}
          <button
            className="btn btn-clear btn-blue-text float-right my-0 mx-0"
            onClick={onHide}
          >
            {t('serviceDetails.eligibilityCard.close')}
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
}

MaxIncomeModal.propTypes = {
  show: PropTypes.bool.isRequired,
  maxIncomes: PropTypes.array.isRequired,
  onHide: PropTypes.func.isRequired
};
