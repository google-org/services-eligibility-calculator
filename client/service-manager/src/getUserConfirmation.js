/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ActionModal from './components/ActionModal';
import React from 'react';
import ReactDOM from 'react-dom';

function getJson(item) {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return item;
  }

  return false;
}

export default function getUserConfirmation(message, callback) {
  const modal = document.createElement('div');
  document.body.appendChild(modal);

  var title = '';
  var description = message;
  var cancelText = 'Cancel';
  var confirmationText = 'Continue';

  const structuredMessage = getJson(message);
  if (structuredMessage) {
    title = structuredMessage.title;
    description = structuredMessage.description;
    cancelText = structuredMessage.cancelText;
    confirmationText = structuredMessage.confirmationText;
  }

  const withCleanup = answer => {
    ReactDOM.unmountComponentAtNode(modal);
    document.body.removeChild(modal);
    callback(answer);
  };

  ReactDOM.render(
    <ActionModal
      title={title}
      cancelText={cancelText}
      onCancel={() => withCleanup(false)}
      actionText={confirmationText}
      onAction={() => withCleanup(true)}
    >
      <div className="body">{description}</div>
    </ActionModal>,
    modal
  );
}
