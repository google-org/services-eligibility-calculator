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

import React, { useState } from 'react';

import ActionModal from '../ActionModal';
import { BASEPATH } from '../../common/config';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { fetch } from '../../common/dataAccess';
import { useService } from '../../hooks';

export default function Remove(props) {
  const service = useService(props.serviceUrl);
  const [deleted, setDeleted] = useState(false);

  const deleteService = service => {
    fetch(service['@id'], { method: 'DELETE' })
      .then(() => {
        setDeleted(true);
      })
      .catch(error => {
        window.alert('Failed to remove:\n\t' + service.name + '\n\n' + error);
        props.onCancel();
      });
  };

  if (deleted) {
    props.onRemove();
    props.onCancel();
    return <Redirect to={BASEPATH + 'services/'} />;
  }

  return (
    service && (
      <ActionModal
        title={(props.draft ? 'Delete ' : 'Archive ') + service.name + '?'}
        analyticsLabel={props.draft ? 'Delete ' : 'Archive '}
        cancelText={'No, cancel'}
        actionText={'Yes, ' + (props.draft ? 'delete' : 'archive')}
        onCancel={props.onCancel}
        onAction={() => deleteService(service)}
      >
        <div className="body">
          {props.draft
            ? 'If you delete this draft, your changes will be lost'
            : 'If you archive this service, residents will not see it in the Eligibility Calculator'}
        </div>
      </ActionModal>
    )
  );
}

Remove.propTypes = {
  serviceUrl: PropTypes.string,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func
};
