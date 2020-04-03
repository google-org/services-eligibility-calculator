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
import React, { useContext, useState } from 'react';

import { Chip } from '../Chip';
import { DataContext } from '../../../DataContext';
import FilterModal from './FilterModal';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { getSelectedInterestNames } from '../../../filters/filterInterests';
import { useTranslation } from 'react-i18next';

function InterestCard({ interest, onClick, selected }) {
  return (
    <Col xs={6} key={interest['@id']} className="card-col">
      <Card
        onClick={onClick}
        className={selected ? 'selected' : ''}
        as="button"
        aria-pressed={selected ? 'true' : 'false'}
      >
        <Card.Body>
          <i className="material-icons card-icon align-top" aria-hidden="true">
            {interest.materialIcon || 'texture'}
          </i>
          <span className="card-text align-middle">{interest.name}</span>
        </Card.Body>
      </Card>
    </Col>
  );
}

function sendAnalytics(interests) {
  let interestList = '';
  let interestCount = 0;
  for (let value of Object.values(interests)) {
    if (interestList.length > 0) {
      interestList += ',';
    }
    interestList += value;
    interestCount++;
    ReactGA.event({
      category: 'Filter',
      action: 'Interests',
      label: value
    });
  }
  ReactGA.event({
    category: 'Filter',
    action: 'AllInterests',
    label: interestList,
    value: interestCount
  });
}

function InterestsFilterModal({
  selectedInterests,
  setSelectedInterests,
  setShow,
  interests
}) {
  const [localState, setLocalState] = useState(selectedInterests);
  const { t } = useTranslation();
  const toggleInterest = interest => {
    const value = localState[interest['@id']] ? undefined : interest.name;
    setLocalState({ ...localState, [interest['@id']]: value });
  };

  return (
    <FilterModal
      className="interests"
      show
      onApply={() => {
        setSelectedInterests(localState);
        setShow(false);
        sendAnalytics(localState);
      }}
      onHide={() => setShow(false)}
      onClear={() => {
        setShow(false);
        setSelectedInterests({});
      }}
      clearDisabled={getSelectedInterestNames(localState).length === 0}
      title={t('filterInterests.modalTitle')}
    >
      <Row className="card-row">
        {interests &&
          interests.map(interest => (
            <InterestCard
              key={interest['@id']}
              onClick={() => toggleInterest(interest)}
              selected={localState[interest['@id']]}
              interest={interest}
            />
          ))}
      </Row>
    </FilterModal>
  );
}

export default function Interests({ selectedInterests, setSelectedInterests }) {
  const [show, setShow] = useState(false);
  const { interests } = useContext(DataContext);
  const { t } = useTranslation();

  const selectedInterestNames = getSelectedInterestNames(selectedInterests);

  return (
    <>
      <Chip
        analytics={{ action: 'Interests', label: 'Add interests' }}
        active={selectedInterestNames.length > 0}
        onClick={() => setShow(true)}
      >
        {selectedInterestNames.length > 0
          ? selectedInterestNames.join(', ')
          : t('filterInterests.buttonAdd')}
      </Chip>
      {show && (
        <InterestsFilterModal
          {...{ selectedInterests, setSelectedInterests, setShow, interests }}
        />
      )}
    </>
  );
}

Interests.propTypes = {
  selectedInterests: PropTypes.object.isRequired,
  setSelectedInterests: PropTypes.func.isRequired
};
