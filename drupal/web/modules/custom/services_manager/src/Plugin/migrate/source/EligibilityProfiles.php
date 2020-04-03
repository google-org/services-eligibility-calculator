<?php
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


namespace Drupal\services_manager\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 *
 * @MigrateSource(
 *   id = "eligibilityprofiles",
 *   source_module = "services_manager",
 * )
 */
class EligibilityProfiles extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Query source data from the 'service_eligibility' table.
    $query = $this->select('service_eligibility', 's')
      ->fields('s', [
          'id',
          'age_max',
          'age_min',
          'citizen_required',
          'fees',
          'income_maxima',
          'other',
          'percent_ami',
          'percent_fpl',
          'resident_required',
        ]);
    return $query;
  }

  /**
   * {@inheritdoc}
   *
   * Keys are the field machine names as used in field mappings, values are
   * descriptions.
   */
  public function fields() {
    $fields = [
      'id' => $this->t('id'),
      'age_max' => $this->t('age_max'),
      'age_min' => $this->t('age_min'),
      'citizen_required' => $this->t('citizen_required'),
      'fees' => $this->t('fees'),
      'income_maxima' => $this->t('income_maxima'),
      'other' => $this->t('other'),
      'percent_ami' => $this->t('percent_ami'),
      'percent_fpl' => $this->t('percent_fpl'),
      'resident_required' => $this->t('resident_required'),
    ];
    return $fields;
  }

  /**
   * {@inheritdoc}
   *
   * The source fields uniquely identifying a source row.
   */
  public function getIds() {
    return [
      'id' => [
        'type' => 'uuid',
        'alias' => 's',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    // convert API Platform's binary(16) id to Drupal's varchar(128) uuid
    $id = $row->getSourceProperty('id');
    $hex = bin2hex($id);
    $hex = preg_replace('/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/', '$1-$2-$3-$4-$5', $hex);
    $row->setSourceProperty('id', $hex);

    # Convert multi-value fields to arrays to generate repeated fields.
    if ($row->getSourceProperty('income_maxima')) {
      $row->setSourceProperty('income_maxima',
        explode(',', $row->getSourceProperty('income_maxima')));
    }

    // Set the "income selector" radio button option based on which income
    // field is populated.
    if (!is_null($row->getSourceProperty('percent_ami'))) {
      $row->setSourceProperty('income_selector', 'ami');
    } else if (!is_null($row->getSourceProperty('percent_fpl'))) {
      $row->setSourceProperty('income_selector', 'fpl');
    } else if (!is_null($row->getSourceProperty('income_maxima'))) {
      $row->setSourceProperty('income_selector', 'custom');
    } else {
      $row->setSourceProperty('income_selector', 'none');
    }
    return parent::prepareRow($row);
  }
}
