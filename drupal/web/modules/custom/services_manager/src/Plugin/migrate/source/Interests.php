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
 *   id = "interests",
 *   source_module = "services_manager",
 * )
 */
class Interests extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // Query source data from the 'interest' table.
    $query = $this->select('interest', 'i')
      ->fields('i', [
          'id',
          'name',
          'material_icon',
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
      'name' => $this->t('name'),
      'material_icon' => $this->t('material_icon'),
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
        'alias' => 'i',
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
    return parent::prepareRow($row);
  }
}
