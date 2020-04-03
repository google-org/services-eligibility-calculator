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

import React, { useEffect } from 'react';

import { Prompt } from 'react-router';
import PropTypes from 'prop-types';

/**
 * A confirmation prompt that will prompt the user before navigating
 * away when the props.when condition is met.
 */
export default function ConfirmationPrompt(props) {
  useEffect(() => {
    if (props.when) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }

    return () => {
      window.onbeforeunload = undefined;
    };
  }, [props.when]);

  return (
    <Prompt
      when={props.when}
      message={JSON.stringify({
        title: props.title,
        description: props.description,
        cancelText: props.cancelText,
        confirmationText: props.confirmationText
      })}
    />
  );
}

ConfirmationPrompt.propTypes = {
  when: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  confirmationText: PropTypes.string.isRequired
};
