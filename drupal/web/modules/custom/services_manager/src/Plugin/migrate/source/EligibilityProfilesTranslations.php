<?php

namespace Drupal\services_manager\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\SqlBase;
use Drupal\migrate\Row;

/**
 *
 * @MigrateSource(
 *   id = "eligibilityprofiles_translations",
 *   source_module = "services_manager",
 * )
 */
class EligibilityProfilesTranslations extends SqlBase {

  /**
   * {@inheritdoc}
   */
  public function query() {
    $query = $this->select('ext_translations', 'e');
    $query->fields('e', [
          'foreign_key',
          'locale',
        ]);
    // Only the 'fees' and 'other' fields are translatable.
    $query->addExpression("MAX(CASE WHEN field = 'fees' THEN content END)", "fees");
    $query->addExpression("MAX(CASE WHEN field = 'other' THEN content END)", "other");
    $query->groupBy('foreign_key');
    $query->groupBy('locale');
    $query->condition('object_class', 'App\Entity\ServiceEligibility', '=');
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
      'fees' => $this->t('fees'),
      'other' => $this->t('other'),
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
