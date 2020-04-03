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

import { Col, Row } from 'react-bootstrap';
import { Field, Form as FinalForm } from 'react-final-form';

import ActionModal from '../ActionModal';
import PropTypes from 'prop-types';
import { REQUIRED_DOMAIN_NAME } from '../../config';
import React from 'react';
import { ToastContext } from '../../App';
import { fetch } from '../../common/dataAccess';
import { sendEmail } from '../../common/utils';

export default function Share(props) {
  const { setToastMessage } = React.useContext(ToastContext);
  const isDraft = props.serviceUrl.includes('service_drafts');

  let onSubmit = async values => {
    var email = values.email;
    var username = email.substring(0, email.indexOf('@'));
    fetch(isDraft ? 'service_draft_shares' : 'service_shares', {
      method: 'POST',
      body: JSON.stringify({
        sharedWithUsername: username,
        service: props.serviceUrl,
        draftService: props.serviceUrl
      })
    })
      .then(() => {
        setToastMessage(props.serviceName + ' shared with ' + email);
        var emailBody =
          "I've shared the following service with you:%0D%0A%0D%0A";
        emailBody += props.serviceName + '%0D%0A';
        emailBody += encodeURIComponent(window.location.href);
        sendEmail(email, 'Shared Service', emailBody);
        props.onShared(username);
      })
      .catch(error => {
        window.alert('Failed to share service.\n' + error);
        props.onCancel();
      });
  };

  let validateEmail = value => {
    var emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    var validationErrors = emailFormat.test(value)
      ? undefined
      : 'Invalid email address';
    if (
      !validationErrors &&
      REQUIRED_DOMAIN_NAME &&
      REQUIRED_DOMAIN_NAME.length > 0
    ) {
      var domainName = value.substring(value.indexOf('@') + 1, value.length);
      validationErrors =
        domainName === REQUIRED_DOMAIN_NAME
          ? undefined
          : 'Address must be  @' + REQUIRED_DOMAIN_NAME;
    }
    return validationErrors;
  };

  let renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.error && data.meta.touched;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    return (
      <>
        <Row>
          <Col sm={3}>
            <label
              htmlFor={`share_${data.input.name}`}
              className={'col-form-label' + (isInvalid ? ' invalid' : '')}
            >
              {data.label}
            </label>
          </Col>
          <Col>
            <input
              {...data.input}
              required={data.required}
              id={`share_${data.input.name}`}
            />
          </Col>
        </Row>
        {data.meta.error && data.meta.touched && (
          <Row>
            <Col sm={3} />
            <Col className="error">{data.meta.error}</Col>
          </Row>
        )}
      </>
    );
  };

  return (
    <ActionModal
      title="Share service"
      analyticsLabel="Share"
      cancelText="Cancel"
      onCancel={props.onCancel}
      actionText="Share"
      onAction={() =>
        document.getElementById('share-form').dispatchEvent(new Event('submit'))
      }
      renderBody={footer => (
        <>
          <p>They will be able to edit, publish, and delete this service</p>
          <FinalForm
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
              <form id={'share-form'} onSubmit={handleSubmit}>
                <div className="form-body">
                  <Field
                    render={renderField}
                    label="Email:"
                    name="email"
                    type="text"
                    required={true}
                    validate={validateEmail}
                  />
                </div>
                {footer}
              </form>
            )}
          />
        </>
      )}
    />
  );
}

Share.propTypes = {
  serviceUrl: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onShare: PropTypes.func
};
