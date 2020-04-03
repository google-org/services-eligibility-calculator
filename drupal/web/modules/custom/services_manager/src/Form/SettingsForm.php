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


namespace Drupal\services_manager\Form;

use Drupal\Core\Entity\EntityForm;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Configure Services Manager settings for this site.
 */
class SettingsForm extends EntityForm {

  protected $settings_info = [
    'ami' => [
      'label' => "AMI values by household size",
    ],
    'fpl' => [
      'label' => "FPL values by household size",
    ],
    'infoBanner' => [
      'label' => "Information Banner",
    ],
  ];

  /**
   * Constructs a SettingsForm object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   The entityTypeManager.
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function form(array $form, FormStateInterface $form_state) {
    $form = parent::form($form, $form_state);

    // Build AMI/FPL income limit fields for households of 1-8 people.
    foreach (['ami', 'fpl'] as $settings_type) {
      $limits = [];
      $label = $this->settings_info[$settings_type]['label'];
      $settings_id = "services_manager_{$settings_type}";
      $settings = $this->entityTypeManager->getStorage('services_manager')->load($settings_id);
      if ($settings) {
        $limits = json_decode($settings->get('value'));
        $label = $settings->label();
      }

      $fieldset = array(
        '#type' => 'fieldset',
        '#title' => $label,
        '#description' => "Content managers will use these values to autocalculate income percentages",
      );
      $table = array(
        '#type' => 'table',
        '#tree' => FALSE,
      );
      foreach (range(0, 7, 2) as $row) {
        foreach (range(1, 2) as $column) {
          $table[$row][$settings_id . "_value_" . ($row + $column)] = array(
            '#type' => 'number',
            '#title' => "Household of " . ($row + $column) ,
            '#maxlength' => 10,
            '#min' => 0,
            '#default_value' => $limits[$row + $column - 1] ?? 0,
            '#required' => TRUE,
          );
        }
      }
      $fieldset["{$settings_type}_table"] = $table;
      $form["{$settings_type}_limits"] = $fieldset;
    }

    $settings_type = "infoBanner";
    $label = "Information Banner";
    $settings_id = "services_manager_{$settings_type}";
    $settings = $this->entityTypeManager->getStorage('services_manager')->load($settings_id);
    $value = '';
    $label = $this->settings_info[$settings_type]['label'];
    if ($settings) {
      $value = $settings->get('value');
      $label = $settings->label();
    }
    $form[$settings_type] = array(
      '#type' => 'fieldset',
      '#title' => $label,
      '#description' => "Display an information banner across the top of every page.",
    );
    $form[$settings_type][$settings_id . "_value"] = array(
      '#type' => 'text_format',
      '#title' => 'Banner Text',
      '#format' => 'basic_html',
      '#allowed_formats' => [ 'basic_html'],
      '#default_value' => $value,
    );
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function save(array $form, FormStateInterface $form_state) {
    $settings = [];
    foreach ($this->settings_info as $settings_type => $setting_info) {
      $settings_id = "services_manager_{$settings_type}";
      $settings[$settings_type] = $this->entityTypeManager->getStorage('services_manager')->load($settings_id);
      if (!$settings[$settings_type]) {
        $settings[$settings_type] = $this->entityTypeManager
          ->getStorage('services_manager')
          ->create(
            [
              'type' => 'settings',
              'id' => $settings_id,
              'name' => $settings_type,
              'label' => $setting_info['label'],
            ]
          );
      }
    }

    $values = [];
    // Income limits combine multiple fields into one value.
    foreach (['ami', 'fpl'] as $settings_type) {
      $value = [];
      foreach (range(1, 8) as $number) {
        $value[] = intval($form_state->getValue($settings[$settings_type]->id() . "_value_{$number}"));
      }
      $values[$settings_type] = json_encode($value);
    }

    // Banner field is a formatted object, but store just the value.
    $format_value = $form_state->getValue($settings['infoBanner']->id() . "_value");
    $values['infoBanner'] = $format_value['value'];

    // Save all.
    foreach ($values as $settings_type => $value) {
      $status = $settings[$settings_type]->set('value', $value)->save();
      if ($status) {
        $this->messenger()->addMessage($this->t('Saved the %label Settings.', [
          '%label' => $settings[$settings_type]->label(),
        ]));
      }
      else {
        $this->messenger()->addMessage($this->t('The %label Settings was not saved.', [
          '%label' => $settings[$settings_type]->label(),
        ]), MessengerInterface::TYPE_ERROR);
      }
    }

    $form_state->setRedirect('services_manager.settings_form');
  }
}
