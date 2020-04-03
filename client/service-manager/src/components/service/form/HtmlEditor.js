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

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { ContentState, EditorState, convertToRaw } from 'draft-js';
import React, { useState } from 'react';

import { Editor } from 'react-draft-wysiwyg';
import Label from './Label';
import { OnChange } from 'react-final-form-listeners';
import PropTypes from 'prop-types';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import sanitizeHtml from 'sanitize-html';

const createEditorState = value => {
  return EditorState.createWithContent(
    ContentState.createFromBlockArray(htmlToDraft(value))
  );
};

export default function HtmlEditor(props) {
  const getInputValue = newEditorState => {
    const textLength = newEditorState.getCurrentContent().getPlainText().length;
    return textLength === 0
      ? ''
      : draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
  };
  const invalid = !!props.meta.error;
  const [editorState, setEditorState] = useState(
    createEditorState(props.input.value)
  );

  return (
    <div className={`form-group row`}>
      <OnChange name={props.input.name}>
        {value => {
          if (getInputValue(editorState) !== value) {
            setEditorState(createEditorState(value || ''));
          }
        }}
      </OnChange>
      <Label {...props} for={props.input.name} invalid={invalid} />
      <div className="col-12 col-md-9">
        <Editor
          editorState={editorState}
          spellCheck
          stripPastedStyles
          onEditorStateChange={newEditorState => {
            setEditorState(newEditorState);
            props.input.onChange(getInputValue(newEditorState));
          }}
          placeholder={
            props.placeholder &&
            sanitizeHtml(props.placeholder, {
              allowedTags: [],
              allowedAttributes: {}
            })
          }
          toolbar={{
            options: ['inline', 'list', 'history', 'link'],
            inline: {
              options: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'superscript',
                'subscript'
              ]
            }
          }}
          wrapperClassName={invalid ? ' is-invalid' : ''}
          wrapperId={`service_${props.input.name}`}
        />
        {invalid && <div className="invalid-feedback">{props.meta.error}</div>}
      </div>
    </div>
  );
}

HtmlEditor.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool
};
