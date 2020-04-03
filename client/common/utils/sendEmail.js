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

/**
 * Sends an email via mailto: link. Adds support to behave in a decent
 * way whether or not the user is using a web-based email client or not.
 *
 * Using the ideas/methods presented here:
 * https://stackoverflow.com/questions/45359575/mailto-link-open-in-new-tab-only-if-web-mail-client
 */
export default function sendEmail(to, subject, body) {
  const windowRef = window.open(
    'mailto:' + to + '?subject=' + subject + '&body=' + body,
    '_blank'
  );

  windowRef && windowRef.focus();

  setTimeout(function() {
    try {
      if (!windowRef.document.hasFocus()) {
        windowRef.close();
      }
    } catch (e) {
      // Log for debugging purposes only.
      console.log(e);
    }
  }, 500);
}
