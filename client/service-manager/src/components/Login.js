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
import { PASSWORD_HELP_EMAIL, REQUIRED_DOMAIN_NAME } from '../config';
import React, { useContext, useEffect, useState } from 'react';

import ActionModal from './ActionModal';
import { AuthContext } from '../App';
import { FORM_ERROR } from 'final-form';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import { login } from '../common/auth';

function recordLoginEvent(label) {
  ReactGA.event({
    category: 'Auth',
    action: 'Login',
    label: label
  });
}

export default function Login(props) {
  const { onLoginStatusChanged } = useContext(AuthContext);
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      document.getElementById('login_username').focus();
      setInitialRender(false);
    }
  }, [initialRender]);

  let onSubmit = async values => {
    // Strip off the domain name if it matches the required client domain.
    let username = values.username;
    if (!username) {
      return;
    }

    let name = username.substring(0, username.lastIndexOf('@'));
    let domain = username.substring(username.lastIndexOf('@') + 1);
    if (domain && domain !== REQUIRED_DOMAIN_NAME) {
      name = username;
    }

    return login(name, values.password)
      .then(() => {
        recordLoginEvent('Success');
        onLoginStatusChanged();
        props.onCancel();
      })
      .catch(e => {
        recordLoginEvent('Failure');
        return { [FORM_ERROR]: 'Incorrect username or password' };
      });
  };

  let renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = !!data.meta.submitFailed;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    return (
      <Row>
        <Col sm={4}>
          <label
            htmlFor={`service_${data.input.name}`}
            className={'col-form-label' + (isInvalid ? ' invalid' : '')}
          >
            {data.label}
          </label>
        </Col>
        <Col>
          <input
            {...data.input}
            required={data.required}
            id={`login_${data.input.name}`}
          />
        </Col>
      </Row>
    );
  };

  return (
    <ActionModal
      title="Login"
      cancelText="Cancel"
      onCancel={props.onCancel}
      actionText="Login"
      onAction={() =>
        document.getElementById('login-form').dispatchEvent(new Event('submit'))
      }
      renderBody={footer => (
        <FinalForm
          onSubmit={onSubmit}
          render={({ submitError, handleSubmit }) => (
            <form id="login-form" onSubmit={handleSubmit}>
              <Field
                render={renderField}
                label="Username or email:"
                name="username"
                type="text"
                required={true}
              />
              <Field
                render={renderField}
                label="Password:"
                name="password"
                type="password"
                required={true}
              />
              {submitError && (
                <Row>
                  <Col sm={4} />
                  <Col className="error">{submitError}</Col>
                </Row>
              )}{' '}
              <button
                type="button"
                onClick={() => {
                  window.open(
                    'mailto:' +
                      PASSWORD_HELP_EMAIL +
                      '?subject=Need password help.'
                  );
                }}
                className="btn btn-blue-text"
              >
                Reset password
              </button>
              {footer}
            </form>
          )}
        />
      )}
    />
  );
}

Login.propTypes = {
  onCancel: PropTypes.func.isRequired
};
