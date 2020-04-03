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
 *   id = "interests_translations",
 *   source_module = "services_manager",
 * )
 */
class InterestsTranslations extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $query = $this->select('ext_translations', 'e');
    $query->fields('e', [
          'foreign_key',
          'locale',
        ]);
    $query->addExpression("MAX(CASE WHEN field = 'name' THEN content END)", "name");
    $query->groupBy('foreign_key');
    $query->groupBy('locale');
    $query->condition('object_class', 'App\Entity\Interest', '=');
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
      'foreign_key' => $this->t('foreign_key'),
      'locale' => $this->t('locale'),
      'name' => $this->t('name'),
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
      'foreign_key' => [
        'type' => 'uuid',
        'alias' => 'e',
      ],
      'locale' => [
        'type' => 'string',
        'max_length' => 8,
        'alias' => 'e',
      ],
    ];
  }
}
