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

import { AuthContext, SettingsContext } from '../../App.js';
import { Field, Form as FinalForm } from 'react-final-form';
import React, { useContext, useState } from 'react';

import Card from '../../common/components/service/Card.js';
import HtmlEditor from '../service/form/HtmlEditor.js';
import HtmlText from '../../common/components/service/show/HtmlText.js';
import { hasRole } from '../../common/utils/index.js';
import saveSetting from './saveSetting.js';

export default function InfoBanner() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [editMode, setEditMode] = useState(false);
  const { loggedInUser } = useContext(AuthContext);
  const isAdmin = hasRole(loggedInUser, 'ROLE_ADMIN');

  const onSave = async values => {
    let settingsSaved = await saveSetting('infoBanner', values.infoBanner);
    if (settingsSaved) {
      setSettings({ ...settings, infoBanner: values.infoBanner });
    }
    return settingsSaved;
  };

  return (
    settings && (
      <FinalForm
        onSubmit={async values => {
          let saveSuccessful = await onSave(values);
          if (saveSuccessful) {
            setEditMode(false);
          }
        }}
        initialValues={{ infoBanner: settings.infoBanner }}
        render={({ handleSubmit, submitting }) => (
          <form onSubmit={handleSubmit}>
            <Card
              header={
                <div className="d-flex justify-content-between">
                  <div>Information Banner</div>
                  <div>
                    {isAdmin &&
                      (editMode ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-blue-text"
                            onClick={() => setEditMode(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary ml-3"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setEditMode(true)}
                        >
                          Edit
                        </button>
                      ))}
                  </div>
                </div>
              }
            >
              <p>
                <i>
                  Display an information banner across the top of every page.
                </i>
              </p>
              {editMode && (
                <Field
                  component={HtmlEditor}
                  label="Banner Text"
                  name="infoBanner"
                  placeholder="The text that should be displayed across the top of every page."
                />
              )}
              {!editMode && <HtmlText html={settings.infoBanner} />}
            </Card>
          </form>
        )}
      />
    )
  );
}
