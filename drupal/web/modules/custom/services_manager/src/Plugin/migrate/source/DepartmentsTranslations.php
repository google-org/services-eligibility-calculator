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
 *   id = "departments_translations",
 *   source_module = "services_manager",
 * )
 */
class DepartmentsTranslations extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    /**
    It would be nice to be able use a simple $database->query() (i.e. static
    query) here, but apparently SqlBase only knows how to deal with dynamic
    query objects (i.e. SelectInterface), so it has to be constructed
    programmatically (even though the Database API docs suggest using query()
    in most situations).

    Create the dynamic query equivalent of:
       SELECT foreign_key,
              locale,
              MAX(CASE WHEN field = 'name' THEN content END) name
       FROM ext_translations
       WHERE object_class = 'App\Entity\Department'
       GROUP BY foreign_key, locale;
    */
    $query = $this->select('ext_translations', 'e');
    $query->fields('e', [
          'foreign_key',
          'locale',
        ]);
    $query->addExpression("MAX(CASE WHEN field = 'name' THEN content END)", "name");
    $query->groupBy('foreign_key');
    $query->groupBy('locale');
    $query->condition('object_class', 'App\Entity\Department', '=');
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
