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
 *   id = "services",
 *   source_module = "services_manager",
 * )
 */
class Services extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    // HACK: Override the default sql_mode to disable ONLY_FULL_GROUP_BY.
    $this->getDatabase()->query("SET SESSION sql_mode = 'ANSI,STRICT_TRANS_TABLES,STRICT_ALL_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER'")->execute();
    // Query source data from the 'service' table.
    $query = $this->select('service', 's')
      ->fields('s', [
          'id',
          'always_accept_applications',
          'application_address',
          'application_documents',
          'application_hours',
          'application_online',
          'application_phone',
          'application_phone_other',
          'application_web_addresses',
          'application_window_end',
          'application_window_start',
          'archived_date_time',
          'contact_email',
          'department_id',
          'description',
          'details',
          'last_modified_by',
          'last_modified_date_time',
          'name',
        ]);
    // HEX() these id fields, otherwise the concat'ed values might not split
    // back out cleanly (i.e. because part of the binary value is interpreted
    // as the "," field delimter).
    $query->addExpression('GROUP_CONCAT(DISTINCT HEX(interest_id))', 'interests');
    $query->addExpression('GROUP_CONCAT(DISTINCT HEX(se.id))', 'eligibility_profiles');
    $query->leftJoin('service_interest', 'si', 's.id = si.service_id');
    $query->leftJoin('service_eligibility', 'se', 's.id = se.service_id');
    $query->groupBy('s.id');
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
      'always_accept_applications' => $this->t('always_accept_applications'),
      'application_address' => $this->t('application_address'),
      'application_documents' => $this->t('application_documents'),
      'application_hours' => $this->t('application_hours'),
      'application_online' => $this->t('application_online'),
      'application_phone' => $this->t('application_phone'),
      'application_phone_other' => $this->t('application_phone_other'),
      'application_web_addresses' => $this->t('application_web_addresses'),
      'application_window_end' => $this->t('application_window_end'),
      'application_window_start' => $this->t('application_window_start'),
      'archived_date_time' => $this->t('archived_date_time'),
      'contact_email' => $this->t('contact_email'),
      'department_id' => $this->t('department_id'),
      'description' => $this->t('description'),
      'details' => $this->t('details'),
      'eligibility_profiles' => $this->t('eligibility_profiles'),
      'interests' => $this->t('interests'),
      'last_modified_by' => $this->t('last_modified_by'),
      'last_modified_date_time' => $this->t('last_modified_date_time'),
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
      'id' => [
        'type' => 'uuid',
        'alias' => 's',
      ],
    ];
  }

  /**
   * Convert API Platform's binary(16) id to Drupal's varchar(128) uuid
   */
  private function idToUuid($id) {
    $hex = bin2hex($id);
    $hex = preg_replace('/([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})/',
        '$1-$2-$3-$4-$5', $hex);
    return $hex;
  }

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    foreach (['id', 'department_id'] as $field) {
      $hex = $this->idToUuid($row->getSourceProperty($field));
      $row->setSourceProperty($field, $hex);
    }

    # Convert multi-value fields to arrays to generate repeated fields.
    if ($row->getSourceProperty('application_web_addresses')) {
      $row->setSourceProperty('application_web_addresses',
        explode(',', $row->getSourceProperty('application_web_addresses')));
    }

    if ($row->getSourceProperty('interests')) {
      $uuids = [];
      foreach (explode(',', $row->getSourceProperty('interests')) as $value) {
        $uuids[] = $this->idToUuid(hex2bin($value));
      }
      $row->setSourceProperty('interests', $uuids);
    }

    // 'eligibility_profiles' can also contain multiple values, but the
    // 'migration_lookup' plugin doesn't appear to handle arrays properly for
    // Paragraphs entities. Instead, format this as an array of arrays for
    // the 'sub_process' plugin, which can then pass the Paragraph UUIDs to
    // 'migration_lookup' individually.
    if ($row->getSourceProperty('eligibility_profiles')) {
      $profiles = [];
      foreach (explode(',', $row->getSourceProperty('eligibility_profiles')) as $value) {
        $profiles[] = [ 'profile_uuid' => $this->idToUuid(hex2bin($value)) ];
      }
      $row->setSourceProperty('eligibility_profiles', $profiles);
    }

    $row->setSourceProperty('published', 1);
    // Drupal doesn't have a notion of archived nodes, so mark archived
    // services as unpublished, which is really more like a service draft, and
    // add "ARCHIVED" to the service name to differentiate from actual drafts.
    if ($row->getSourceProperty('archived_date_time')) {
      $row->setSourceProperty('published', 0);
      $row->setSourceProperty('name', '[ARCHIVED] ' . $row->getSourceProperty('name'));
    }

    return parent::prepareRow($row);
  }
}
