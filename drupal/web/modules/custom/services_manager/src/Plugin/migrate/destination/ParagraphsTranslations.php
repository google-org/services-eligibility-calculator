<?php

namespace Drupal\services_manager\Plugin\migrate\destination;

use Drupal\entity_reference_revisions\Plugin\migrate\destination\EntityReferenceRevisions;
use Drupal\migrate\Row;

/**
 * Provides entity_reference_revisions destination plugin.
 *
 * @MigrateDestination(
 *   id = "paragraphs_translations",
 * )
 */
class ParagraphsTranslations extends EntityReferenceRevisions {

  /**
   * {@inheritdoc}
   */
  protected static function getEntityTypeId($pluginId) {
    return 'paragraph';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEntity(Row $row, array $oldDestinationIdValues) {
    // Only need to override handling for translation entities.
    if (!$this->isTranslationDestination()) {
      return parent::getEntity($row, $oldDestinationIdValues);
    }

    // Attempt to ensure we always have a bundle.
    if ($bundle = $this->getBundle($row)) {
      $row->setDestinationProperty($this->getKey('bundle'), $bundle);
    }
    // Stubs might need some required fields filled in.
    if ($row->isStub()) {
      $this->processStubRow($row);
    }

    $langcode = $row->getDestinationProperty('langcode');
    $base_id = $row->getDestinationProperty('id');
    $entity = $this->storage->load($base_id[0]);
    if ($entity->getRevisionId() != $base_id[1]) {
      $entity = $this->storage->loadRevision($base_id[1]);
    }

    // If a matching translation already exists, just delete and recreate it.
    if ($entity->hasTranslation($langcode)) {
      $translation = $entity->getTranslation($langcode);
      if (!$translation->isDefaultTranslation()) {
        $entity->removeTranslation($langcode);
        $entity->save();
      }
    }
    $entity->addTranslation($langcode, [
        'field_other' => $row->getDestinationProperty('field_other'),
        'field_fees' => $row->getDestinationProperty('field_fees'),
    ]);
    $entity->save();
    return $entity->getTranslation($langcode);
  }
}
