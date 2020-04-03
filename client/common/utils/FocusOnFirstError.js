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

import React, { useEffect, useState } from 'react';

import { getIn } from 'final-form';
import { useFormState } from 'react-final-form';

// Returns all focusable input elements in the document
const getAllInputs = () => {
  if (typeof document === 'undefined') {
    return [];
  }

  // Find all focusable inputs
  return Array.prototype.slice
    .call(document.forms)
    .reduce(
      (accumulator, form) =>
        accumulator.concat(
          Array.prototype.slice
            .call(form)
            .filter(
              element => !!(element && typeof element.focus === 'function')
            )
        ),
      []
    )
    .concat(
      // Find all rich-text editors
      Array.from(document.getElementsByClassName('rdw-editor-wrapper')).map(
        element => {
          let textbox = element.querySelector('[role=textbox]');
          textbox.name = element.id.split('service_').pop();
          return textbox;
        }
      )
    );
};

// Finds the first input field with an error
const findErrorInput = (inputs, errors) => {
  let firstError = {};
  if (errors) {
    firstError[Object.keys(errors)[0]] = Object.values(errors)[0];
  }
  return inputs.find(
    input =>
      input.name &&
      (getIn(firstError, input.name) ||
        (input.attributes.groupname &&
          getIn(firstError, input.attributes.groupname.value)))
  );
};

/**
 * This react component will focus on the first error in the form
 * when initially rendered.
 */
export default function FocusOnFirstError() {
  const [done, setDone] = useState(false);
  const state = useFormState();
  const errors = state.errors;

  useEffect(() => {
    if (!done) {
      if (errors) {
        let firstErrorInput = findErrorInput(getAllInputs(), errors);
        if (firstErrorInput) {
          firstErrorInput.focus();
        }
      }
      setDone(true);
    }
  }, [done, errors]);

  return <></>;
}
