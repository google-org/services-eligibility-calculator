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

import { Card, Col, Row } from 'react-bootstrap';
import React, { useState } from 'react';

import { Chip } from '../Chip';
import { ExternalLink } from '../../../common/utils';
import FilterModal from './FilterModal';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';

function AddressCard({ children, onClick, selected, materialIcon }) {
  return (
    <Col xs={12} className="card-col">
      <Card
        onClick={onClick}
        as="button"
        className={selected ? 'selected' : ''}
        aria-pressed={selected ? 'true' : 'false'}
      >
        <Card.Body>
          <i className="material-icons card-icon align-top" aria-hidden="true">
            {materialIcon}
          </i>
          <span className="card-text align-middle">{children}</span>
        </Card.Body>
      </Card>
    </Col>
  );
}

function sendAnalytics(resident) {
  ReactGA.event({
    category: 'Filter',
    action: 'Resident',
    label: resident.toString()
  });
}

function AddressFilterModal({ resident, setResident, setShow }) {
  const [localState, setLocalState] = useState(resident);
  const { t } = useTranslation();

  return (
    <FilterModal
      className="address"
      show
      onApply={() => {
        setResident(localState);
        setShow(false);
        localState !== undefined && sendAnalytics(localState);
      }}
      onHide={() => setShow(false)}
      onClear={() => {
        setShow(false);
        setResident(undefined);
      }}
      clearDisabled={localState == null}
      title={t('filterAddress.modalTitle')}
    >
      <Row>
        <Col xs={12} className="mt-2 mb-3">
          <span className="input-label">
            {t('filterAddress.modalDescription')}
          </span>
        </Col>
      </Row>
      <Row className="card-row">
        <AddressCard
          onClick={() => setLocalState(true)}
          selected={localState === true}
          materialIcon="check"
        >
          {t('filterAddress.resident')}
        </AddressCard>
        <AddressCard
          onClick={() => setLocalState(false)}
          selected={localState === false}
          materialIcon="close"
        >
          {t('filterAddress.notResident')}
        </AddressCard>
      </Row>
      <Row>
        <Col xs={12} className="mt-3 text-center">
          <ExternalLink
            className="no-text-decoration"
            url={t('filterAddress.unsureLink')}
            action="ResidencyDetermination"
          >
            <span className="unsure-link">
              {t('filterAddress.unsureLinkText')}{' '}
              <i className="material-icons align-top" aria-hidden="true">
                open_in_new
              </i>
            </span>
          </ExternalLink>
        </Col>
      </Row>
    </FilterModal>
  );
}

export default function Address({ resident, setResident }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Chip
        analytics={{ action: 'Address', label: 'Add address' }}
        active={resident != null}
        onClick={() => setShow(true)}
      >
        {resident == null && t('filterAddress.buttonAdd')}
        {resident === true && t('filterAddress.buttonCity')}
        {resident === false && t('filterAddress.buttonNotCity')}
      </Chip>
      {show && <AddressFilterModal {...{ resident, setResident, setShow }} />}
    </>
  );
}

Address.propTypes = {
  resident: PropTypes.bool,
  setResident: PropTypes.func.isRequired
};
