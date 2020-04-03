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
 *   id = "services_translations",
 *   source_module = "services_manager",
 * )
 */
class ServicesTranslations extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $query = $this->select('ext_translations', 'e');
    $query->fields('e', [
          'foreign_key',
          'locale',
        ]);
    // These are all the Service fields that support translation. This maps the
    // values stored in the translation table's 'name' field to the field names
    // in the 'service' table. This isn't strictly necessary, but it provides
    // some extra consistency for the service migration YAML configs, which is
    // helpful for copying/pasting between them.
    $field_names = [
        'applicationAddress' => 'application_address',
        'applicationDocuments' => 'application_documents',
        'applicationHours' => 'application_hours',
        'applicationOnline' => 'application_online',
        'applicationPhone' => 'application_phone',
        'applicationPhoneOther' => 'application_phone_other',
        'applicationWebAddresses' => 'application_web_addresses',
        'contactEmail' => 'contact_email',
        'description' => 'description',
        'details' => 'details',
        'name' => 'name',];
    foreach ($field_names as $field_value => $field_name) {
      $query->addExpression("MAX(CASE WHEN field = '$field_value' THEN content END)",
          $field_name);
    }
    $query->groupBy('foreign_key');
    $query->groupBy('locale');
    $query->condition('object_class', 'App\Entity\Service', '=');
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
      'application_address' => $this->t('application_address'),
      'application_documents' => $this->t('application_documents'),
      'application_hours' => $this->t('application_hours'),
      'application_online' => $this->t('application_online'),
      'application_phone' => $this->t('application_phone'),
      'application_phone_other' => $this->t('application_phone_other'),
      'application_web_addresses' => $this->t('application_web_addresses'),
      'contact_email' => $this->t('contact_email'),
      'description' => $this->t('description'),
      'details' => $this->t('details'),
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

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    # Convert multi-value fields to arrays to generate repeated fields.
    if ($row->getSourceProperty('application_web_addresses')) {
      $row->setSourceProperty('application_web_addresses',
        explode(',', $row->getSourceProperty('application_web_addresses')));
    }

    return parent::prepareRow($row);
  }

}
