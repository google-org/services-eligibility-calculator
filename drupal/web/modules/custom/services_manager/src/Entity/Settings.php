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


namespace Drupal\services_manager\Entity;

use Drupal\Core\Config\Entity\ConfigEntityBase;
use Drupal\services_manager\SettingsInterface;

/**
 * Defines the Settings entity.
 *
 * @ConfigEntityType(
 *   id = "services_manager",
 *   label = @Translation("Services Manager Settings"),
 *   handlers = {
 *     "list_builder" = "Drupal\services_manager\Controller\SettingsListBuilder",
 *     "access" = "Drupal\services_manager\SettingsAccessControlHandler",
 *     "form" = {
 *       "default" = "Drupal\services_manager\Form\SettingsForm",
 *       "edit" = "Drupal\services_manager\Form\SettingsForm",
 *     }
 *   },
 *   config_prefix = "settings",
 *   admin_permission = "administer services_manager configuration",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "label",
 *   },
 *   config_export = {
 *     "id",
 *     "label",
 *     "name",
 *     "value"
 *   },
 *   links = {
 *     "canonical" = "/admin/config/system/services_manager",
 *     "edit-form" = "/admin/config/system/services_manager",
 *   }
 * )
 */
class Settings extends ConfigEntityBase implements SettingsInterface {

  /**
   * The machine name for the configuration entity.
   *
   * @var string
   */
  public $id;

  /**
   * The friendly UI label for the configuration entity.
   *
   * @var string
   */
  public $label;

  /**
   * The name of the configuration entity name/value pair.
   *
   * @var string
   */
  public $name;

  /**
   * The value of the configuration entity name/value pair.
   *
   * @var string
   */
  public $value;
}
