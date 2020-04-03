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

import Card from '../Card';
import HtmlText from './HtmlText';
import MaxIncomeModal from './MaxIncomeModal';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * Displays a row of eligibility criteria
 */
function EligibilityRow({ icon, text, color, background }) {
  return (
    <Row className="eligibility">
      <Col xs={1} className="label">
        <i
          className="material-icons apply-icon align-middle"
          style={{ color: color, background: background }}
          aria-hidden="true"
        >
          {icon}
        </i>
      </Col>
      <Col>{text}</Col>
    </Row>
  );
}

EligibilityRow.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.node.isRequired,
  color: PropTypes.string,
  background: PropTypes.string
};

/**
 * Displays details of a single eligibility profile.
 */
function EligibilityProfile({ profile, isLast, ami, fpl, householdSize }) {
  const { t } = useTranslation();
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  let householdSizeIndex = householdSize
    ? Math.min(ami.length - 1, householdSize - 1)
    : 0;

  const forYoungChildren = () => {
    return profile.ageMax && profile.ageMax <= 12;
  };

  const eligibilityAgeText = () => {
    const ageMin = profile.ageMin;
    const ageMax = profile.ageMax;
    if (ageMin && !ageMax)
      return t('serviceDetails.eligibilityCard.overCountYears', {
        count: ageMin
      });
    if (ageMax && !ageMin)
      return t('serviceDetails.eligibilityCard.underCountYears', {
        count: ageMax
      });
    if (ageMin && ageMax)
      return t('serviceDetails.eligibilityCard.rangeYears', { ageMin, ageMax });
    return '';
  };

  const calculateMaxIncomes = () => {
    const percentAMI = profile.percentAMI;
    const percentFPL = profile.percentFPL;
    const custom = profile.incomeMaxima;
    let maxIncomes = [];
    if (percentAMI) {
      maxIncomes = ami.map(income => percentAMI * 0.01 * income);
    } else if (percentFPL) {
      maxIncomes = fpl.map(income => percentFPL * 0.01 * income);
    } else if (custom && custom.length > 0) {
      maxIncomes = custom.map(income => parseInt(income));
    }
    return maxIncomes;
  };

  const maxIncomes = calculateMaxIncomes();

  const eligibilityIncomeText = () => {
    if (!maxIncomes) return '';
    if (maxIncomes.length <= householdSizeIndex) {
      householdSizeIndex = maxIncomes.length - 1;
    }
    const income = maxIncomes[householdSizeIndex].toLocaleString(undefined, {
      maximumFractionDigits: 0
    });
    return (
      <>
        <span aria-hidden="true">
          {t('serviceDetails.eligibilityCard.maxIncome', {
            income
          })}{' '}
        </span>
        <button
          className="btn btn-clear btn-gutter"
          onClick={() => setShowIncomeModal(true)}
          aria-label={
            t('serviceDetails.eligibilityCard.maxIncome', {
              income
            }) +
            ' ' +
            t('serviceDetails.eligibilityCard.householdSize', {
              householdSize: householdSizeIndex + 1
            })
          }
        >
          (
          {t('serviceDetails.eligibilityCard.householdSize', {
            householdSize: householdSizeIndex + 1
          })}
          )
        </button>
      </>
    );
  };

  const hasEligibilityRequirements =
    profile.ageMin ||
    profile.ageMax ||
    profile.percentAMI ||
    profile.percentFPL ||
    (profile.incomeMaxima && profile.incomeMaxima.length > 0) ||
    profile.fees ||
    profile.residentRequired ||
    profile.citizenRequired;

  return (
    <>
      <MaxIncomeModal
        show={showIncomeModal}
        maxIncomes={maxIncomes}
        onHide={() => setShowIncomeModal(false)}
      />
      <Row>
        {hasEligibilityRequirements && (
          <Col md={6}>
            {!forYoungChildren(profile) &&
              (profile.ageMin || profile.ageMax) && (
                <EligibilityRow
                  text={eligibilityAgeText()}
                  icon="person_outline"
                  color="#e37400"
                  background="#fef7e0"
                />
              )}
            {forYoungChildren(profile) && (
              <EligibilityRow
                text={t('serviceDetails.eligibilityCard.childrenAgesRange', {
                  ageMin: profile.ageMin || '0',
                  ageMax: profile.ageMax
                })}
                icon="child_friendly"
                color="#e52592"
                background="#fde7f3"
              />
            )}
            {(profile.percentAMI ||
              profile.percentFPL ||
              (profile.incomeMaxima && profile.incomeMaxima.length > 0)) && (
              <EligibilityRow
                text={eligibilityIncomeText()}
                icon="attach_money"
                color="#188038"
                background="#e6f4ea"
              />
            )}
            {profile.fees && (
              <EligibilityRow
                text={profile.fees}
                icon="assignment"
                color="#c5221f"
                background="#fce8e6"
              />
            )}
            {profile.residentRequired && (
              <EligibilityRow
                text={t('serviceDetails.eligibilityCard.livesInMunicipality')}
                icon="location_on"
                color="#1a73e8"
                background="#e8f0fe"
              />
            )}
            {profile.citizenRequired && (
              <EligibilityRow
                text={t(
                  'serviceDetails.eligibilityCard.proofOfResidencyRequired'
                )}
                icon="outlined_flag"
                color="#9334e6"
                background="#f3e8fd"
              />
            )}
          </Col>
        )}
        <Col md={hasEligibilityRequirements ? 6 : 12}>
          {!profile.ageMin && !profile.ageMax && (
            <EligibilityRow
              text={t('serviceDetails.eligibilityCard.allAges')}
              icon="person_outline"
            />
          )}

          {!profile.percentAMI &&
            !profile.percentFPL &&
            (!profile.incomeMaxima || profile.incomeMaxima.length === 0) && (
              <EligibilityRow
                text={t('serviceDetails.eligibilityCard.allIncomes')}
                icon="attach_money"
              />
            )}
          {!profile.fees && (
            <EligibilityRow
              text={t('serviceDetails.eligibilityCard.noFees')}
              icon="assignment"
            />
          )}
          {!profile.residentRequired && (
            <EligibilityRow
              text={t('serviceDetails.eligibilityCard.allCommunities')}
              icon="location_on"
            />
          )}
          {!profile.citizenRequired && (
            <EligibilityRow
              text={t(
                'serviceDetails.eligibilityCard.proofOfResidencyNotRequired'
              )}
              icon="outlined_flag"
            />
          )}
        </Col>
      </Row>
      {profile.other && (
        <Row>
          <Col>
            <div className="label">
              {t('serviceDetails.eligibilityCard.other')}:
            </div>
            <div className="text-break eligibility-other">
              <HtmlText html={profile.other} />
            </div>
          </Col>
        </Row>
      )}
      {!isLast && (
        <div className="eligibility-or">
          <span>{t('serviceDetails.eligibilityCard.or')}</span>
        </div>
      )}
    </>
  );
}

EligibilityProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  isLast: PropTypes.bool.isRequired,
  ami: PropTypes.array.isRequired,
  fpl: PropTypes.array.isRequired,
  householdSize: PropTypes.number
};

/**
 * Card used for displaying service eligibility details.
 */
export default function EligibilityCard({
  eligibilityProfiles,
  ami,
  fpl,
  householdSize
}) {
  const { t } = useTranslation();
  return (
    <Card collapsible title={t('serviceDetails.eligibilityCard.whoIsEligible')}>
      {ami &&
        fpl &&
        eligibilityProfiles.map((profile, ind) => (
          <EligibilityProfile
            key={ind}
            profile={profile}
            isLast={ind === eligibilityProfiles.length - 1}
            ami={ami}
            fpl={fpl}
            householdSize={householdSize}
          />
        ))}
    </Card>
  );
}

EligibilityCard.propTypes = {
  eligibilityProfiles: PropTypes.array.isRequired,
  ami: PropTypes.array,
  fpl: PropTypes.array,
  householdSize: PropTypes.number
};
