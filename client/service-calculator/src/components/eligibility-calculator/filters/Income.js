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
import Slider from '@material-ui/core/Slider';
import ValueLabel from '@material-ui/core/Slider/ValueLabel';
import { useTranslation } from 'react-i18next';

const INCOME_MAX = 99;

const IncomeSliderLabel = props => {
  let label = props.value.toString();
  if (props.value > 0) {
    label += 'K';
  }
  if (props.value === INCOME_MAX) {
    label += '+';
  }
  return <ValueLabel {...props} value={label} />;
};

const IncomeChipText = ({ income }) => {
  const { t } = useTranslation();
  if (income === undefined) {
    return t('filterIncome.buttonAdd');
  }
  let label = `$${income}`;
  if (income > 0) {
    label += ',000';
  }
  if (income === INCOME_MAX) {
    label += '+';
  }
  return <>{label}</>;
};

function sendAnalytics(income) {
  ReactGA.event({
    category: 'Filter',
    action: 'Income',
    value: income * 1000
  });
}

function IncomeFilterModal({ income, setIncome, setShow }) {
  const [sliderState, setSliderState] = useState(income);
  const { t } = useTranslation();

  return (
    <FilterModal
      className="income"
      show
      onApply={() => {
        setIncome(sliderState);
        setShow(false);
        sendAnalytics(sliderState);
      }}
      onHide={() => setShow(false)}
      onClear={() => {
        setShow(false);
        setIncome(undefined);
      }}
      clearDisabled={sliderState === undefined}
      title={t('filterIncome.modalTitle')}
    >
      <Row>
        <Col xs={12} className="mt-1 mb-4">
          <span className="input-label">
            {t('filterIncome.modalDescription')}
          </span>
        </Col>
        <Col xs={12} className="income-slider-col">
          <Slider
            ValueLabelComponent={IncomeSliderLabel}
            min={0}
            max={99}
            step={1}
            value={sliderState || 0}
            valueLabelDisplay="on"
            onChange={(_, value) => {
              setSliderState(value);
            }}
            aria-label={t('filterIncome.label')}
            getAriaValueText={value =>
              value +
              (value > 0 && ' ' + t('filterIncome.thousand')) +
              ((value === INCOME_MAX && '+') || '') +
              ' ' +
              t('filterIncome.dollars')
            }
          ></Slider>
        </Col>
      </Row>
    </FilterModal>
  );
}

export default function Income({ income, setIncome }) {
  const [show, setShow] = useState(false);

  return (
    <>
      <Chip
        analytics={{ action: 'Income', label: 'Add income' }}
        active={income !== undefined}
        onClick={() => setShow(true)}
      >
        <IncomeChipText income={income} />
      </Chip>
      {show && <IncomeFilterModal {...{ income, setIncome, setShow }} />}
    </>
  );
}

Income.propTypes = {
  income: PropTypes.number,
  setIncome: PropTypes.func.isRequired
};
