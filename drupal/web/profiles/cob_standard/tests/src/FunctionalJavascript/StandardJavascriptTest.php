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


namespace Drupal\Tests\standard\FunctionalJavascript;

use Drupal\FunctionalJavascriptTests\WebDriverTestBase;
use Drupal\node\Entity\Node;

/**
 * Tests Standard installation profile JavaScript expectations.
 *
 * @group standard
 */
class StandardJavascriptTest extends WebDriverTestBase {

  /**
   * {@inheritdoc}
   */
  protected $profile = 'standard';

  /**
   * Tests BigPipe accelerates particular Standard installation profile routes.
   */
  public function testBigPipe() {
    $this->drupalLogin($this->drupalCreateUser([
      'access content',
      'post comments',
      'skip comment approval',
    ]));

    $node = Node::create(['type' => 'article'])
      ->setTitle($this->randomMachineName())
      ->setPromoted(TRUE)
      ->setPublished();
    $node->save();

    // Front page: one placeholder, for messages.
    $this->drupalGet('');
    $this->assertBigPipePlaceholderReplacementCount(1);

    // Node page: 2 placeholders:
    // 1. messages
    // 2. comment form
    $this->drupalGet($node->toUrl());
    $this->assertBigPipePlaceholderReplacementCount(2);
  }

  /**
   * Asserts the number of BigPipe placeholders that are replaced on the page.
   *
   * @param int $expected_count
   *   The expected number of BigPipe placeholders.
   */
  protected function assertBigPipePlaceholderReplacementCount($expected_count) {
    $web_assert = $this->assertSession();
    $web_assert->waitForElement('css', 'script[data-big-pipe-event="stop"]');
    $page = $this->getSession()->getPage();
    $this->assertCount($expected_count, $this->getDrupalSettings()['bigPipePlaceholderIds']);
    $this->assertCount($expected_count, $page->findAll('css', 'script[data-big-pipe-replacement-for-placeholder-with-id]'));
  }

}
