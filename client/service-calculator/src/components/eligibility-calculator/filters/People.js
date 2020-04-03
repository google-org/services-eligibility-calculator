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

import { Col, Row } from 'react-bootstrap';
import React, { useState } from 'react';

import { Chip } from '../Chip';
import FilterModal from './FilterModal';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { capitalize } from '../../../common/utils';
import { getTotalPeople } from '../../../filters/filterAge';
import { useTranslation } from 'react-i18next';

function PersonInput({ label, description, onChange, value }) {
  const { t } = useTranslation();
  return (
    <Row className="my-3">
      <Col xs={6}>
        <span className="input-label">{label}</span>
        <span className="people-input-description">{description}</span>
      </Col>
      <Col xs={6} className="people-input">
        <button
          className="btn btn-people-input"
          onClick={() => onChange(value - 1)}
          disabled={value < 1}
          aria-label={`${t('filterPeople.buttonDecreaseLabel')} ${label}`}
        >
          <i className="material-icons align-middle">remove</i>
        </button>
        <span className="people-input-value align-middle">{value}</span>
        <button
          className="btn btn-people-input"
          onClick={() => onChange(value + 1)}
          aria-label={`${t('filterPeople.buttonIncreaseLabel')} ${label}`}
        >
          <i className="material-icons align-middle">add</i>
        </button>
      </Col>
    </Row>
  );
}

function sendAnalytics(people) {
  let totalPeople = 0;
  for (let [key, value] of Object.entries(people)) {
    if (value > 0) {
      totalPeople += value;
      ReactGA.event({
        category: 'Filter',
        action: 'People',
        label: capitalize(key),
        value: value
      });
    }
  }
  ReactGA.event({
    category: 'Filter',
    action: 'People',
    label: 'HouseholdSize',
    value: totalPeople
  });
}

function PeopleFilterModal({ people, setPeople, setShow }) {
  const [localState, setLocalState] = useState(people);
  const { t } = useTranslation();

  return (
    <FilterModal
      className="people"
      show
      onApply={() => {
        setPeople(localState);
        setShow(false);
        sendAnalytics(localState);
      }}
      onHide={() => setShow(false)}
      onClear={() => {
        setShow(false);
        setPeople({});
      }}
      clearDisabled={getTotalPeople(localState) === 0}
      title={t('filterPeople.modalTitle')}
    >
      <PersonInput
        label={t('filterPeople.labelOlderAdults')}
        description={t('filterPeople.descriptionOlderAdults')}
        value={localState.olderAdults || 0}
        onChange={n => setLocalState({ ...localState, olderAdults: n })}
      />

      <PersonInput
        label={t('filterPeople.labelAdults')}
        description={t('filterPeople.descriptionAdults')}
        value={localState.adults || 0}
        onChange={n => setLocalState({ ...localState, adults: n })}
      />

      <PersonInput
        label={t('filterPeople.labelTeens')}
        description={t('filterPeople.descriptionTeens')}
        value={localState.teens || 0}
        onChange={n => setLocalState({ ...localState, teens: n })}
      />

      <PersonInput
        label={t('filterPeople.labelChildren')}
        description={t('filterPeople.descriptionChildren')}
        value={localState.children || 0}
        onChange={n => setLocalState({ ...localState, children: n })}
      />
    </FilterModal>
  );
}

export default function People({ people, setPeople }) {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const totalPeople = getTotalPeople(people);

  return (
    <>
      <Chip
        analytics={{ action: 'People', label: 'Add people' }}
        active={totalPeople > 0}
        onClick={() => setShow(true)}
      >
        {totalPeople > 0
          ? t('filterPeople.buttonWithCount', { count: totalPeople })
          : t('filterPeople.buttonAdd')}
      </Chip>
      {show && <PeopleFilterModal {...{ people, setPeople, setShow }} />}
    </>
  );
}

People.propTypes = {
  people: PropTypes.object.isRequired,
  setPeople: PropTypes.func.isRequired
};
