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


namespace Drupal\services_manager\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\migrate\process\MigrationLookup;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * If a Service translation doesn't provide a value for a field, use the
 * coreesponding value from the base language.
 *
 * @MigrateProcessPlugin(
 *   id = "services_translation_fallback"
 * )
 *
 * Usage example:
 *
 * @code
 * field_name:
 *   plugin: services_translation_fallback
 *   source: source_field
 *   migration: migration_name
 *   migration_source: lookup_id_field
 * @endcode
 *
 */
class ServicesTranslationsFallback extends MigrationLookup {

  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    if ($value) {
      return $value;
    }
    $migrate_lookup = $row->getSourceProperty($this->configuration['migration_source']);
    $migrate_id = parent::transform($migrate_lookup, $migrate_executable, $row, $destination_property);
    $node =\Drupal::entityTypeManager()->getStorage('node')->load($migrate_id);

    // The field "value" is actually a FieldItemList, which is an array of
    // field items, which is just an array with one or more field properties,
    // but always a 'value' element. This will extract a simple indexed array
    // of those values.
    $field = explode('/', $destination_property)[0];
    $sub_property = explode('/', $destination_property)[1] ?? 'value';
    $values = array_column($node->get($field)->getValue(), $sub_property);

    # If there's only a single value, return that directly, otherwise migration
    # might try to convert the array to an improper value (e.g. to the string
    # "Array" where a string is expected) rather than extracting the contents
    # of the array (this seems to be the case at least when assigning to a
    # nested field property, like "foo/value").
    if (count($values) <= 1 ) {
      return $values[0] ?? null;
    }
    return $values;
  }
}
