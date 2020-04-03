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

const fs = require('fs').promises;
const globalFetch = require('node-fetch');
const prettier = require('prettier');
const jestDiff = require('jest-diff');
const chalk = require('chalk');

import { LocalStorage } from 'node-localstorage';
import { fetch } from '../common/dataAccess';
import { login } from '../common/auth';

global.fetch = globalFetch;
global.Headers = globalFetch.Headers;
global.localStorage = new LocalStorage('./scratch');

let deterministicIdMap = {};
let deterministicIdCounter = {};

let licenseHeader = `/**
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

`;

async function getAllData(type, queryParams, loginUser) {
  let fetchUrl = `${type}/?pagination=false&order[name]=asc&order[description]=asc${queryParams}`;
  await login(loginUser.user, loginUser.password);
  let response = await fetch(fetchUrl);

  return await response.json();
}

function getNextDeterministicId(type) {
  if (deterministicIdCounter[type] === undefined) {
    deterministicIdCounter[type] = 0;
  }

  return (deterministicIdCounter[type]++).toString();
}

function getDeterministicId(fullId) {
  let { type, id, subtype } = fullId.match(
    /(?<type>\/([^\/]*\/){2})(?<id>[^\/]*)(\/(?<subtype>).*)?/
  ).groups;
  if (deterministicIdMap[`${type}${id}`] === undefined) {
    let newId =
      type === '/api/settings/' || type === '/api/user_activities/'
        ? id
        : getNextDeterministicId(type);
    deterministicIdMap[`${type}${id}`] = {
      '@id': `${type}${newId}`,
      id: newId
    };
  }

  return deterministicIdMap[`${type}${id}`];
}

function makeChildIdsDeterministic(entry) {
  let childrenToOverwrite = Object.keys(entry).reduce((prev, childKey) => {
    let child = entry[childKey];
    if (child && child['@id'] !== undefined) {
      prev[childKey] = makeEntryDeterministic(child);
    }
    if (
      childKey == 'history' ||
      childKey == 'interests' ||
      childKey == 'eligibilityProfiles'
    ) {
      prev[childKey] = child.map(entry => makeEntryDeterministic(entry));
    }
    if (childKey == 'serviceId') {
      prev[childKey] = getDeterministicId('/api/services/' + child).id;
    }
    return prev;
  }, {});
  return { ...entry, ...childrenToOverwrite };
}

function makeEntryDeterministic(entry) {
  let newId = getDeterministicId(entry['@id']);

  if (entry['draft'] && typeof entry['draft'] === 'string') {
    entry['draft'] = getDeterministicId(entry['draft'])['@id'];
  }
  if (entry['service'] && typeof entry['service'] === 'string') {
    entry['service'] = getDeterministicId(entry['service'])['@id'];
  }
  if (entry['lastModifiedAgo']) {
    // Hard-code so doesn't change as time progresses
    entry['lastModifiedAgo'] = '20 days ago';
  }
  if (entry['lastLogin']) {
    // Hard-code so date never changes
    entry['lastLogin'] = '2020-02-27T20:02:04+00:00';
  }
  let newIdCopy = { ...newId };
  if (entry.id === undefined) delete newIdCopy.id;
  let processedEntry = makeChildIdsDeterministic(entry);
  return {
    ...processedEntry,
    ...newIdCopy
  };
}

function makeIdsDeterministic(data) {
  data['hydra:member'] = data['hydra:member'].map(makeEntryDeterministic);
  return data;
}

async function buildMockFileContents(path, type, queryParams, loginUser) {
  let data = await getAllData(type, queryParams, loginUser);
  data = makeIdsDeterministic(data);
  let prettierOptions = await prettier.resolveConfig(path);
  prettierOptions.filepath = path;
  return (
    licenseHeader +
    prettier.format(
      `export const ${type} = ${JSON.stringify(data)}; \n`,
      prettierOptions
    )
  );
}

async function createMockFile(
  path,
  type,
  queryParams = '',
  loginUser = { user: 'user', password: 'user-test' }
) {
  let content = await buildMockFileContents(path, type, queryParams, loginUser);
  await fs.writeFile(path, content, 'utf8');
}

async function checkMockFile(
  path,
  type,
  queryParams = '',
  loginUser = { user: 'user', password: 'user-test' }
) {
  let received = await buildMockFileContents(
    path,
    type,
    queryParams,
    loginUser
  );
  let expected = await fs.readFile(path, 'utf8');
  if (expected !== received) {
    console.error(`\n${chalk.white.bgRed.bold(' FAIL ')} ${path}`);
    console.error(jestDiff(expected, received, { expand: false }));
    return chalk.red(`Mock file ${path} does not match.`);
  } else {
    console.log(`\n${chalk.white.bgGreen.bold(' PASS ')} ${path}`);
    return null;
  }
}

async function updateSnapshots() {
  console.log('Updating mock data.');
  await createMockFile(`${__dirname}/mockRawInterestData.js`, 'interests');
  await createMockFile(`${__dirname}/mockRawDepartmentData.js`, 'departments');
  await createMockFile(
    `${__dirname}/mockRawServiceData.js`,
    'services',
    '&exists[archivedDateTime]=false'
  );
  await createMockFile(
    `${__dirname}/mockRawArchivedServiceData.js`,
    'services',
    '&exists[archivedDateTime]=true'
  );
  await createMockFile(
    `${__dirname}/mockRawServiceDraftData.js`,
    'service_drafts'
  );
  await createMockFile(
    `${__dirname}/mockRawServiceHistoryData.js`,
    'service_histories'
  );
  await createMockFile(
    `${__dirname}/mockRawServiceActivityData.js`,
    'service_activities',
    '',
    { user: 'admin', password: 'admin-test' }
  );
  await createMockFile(
    `${__dirname}/mockRawUserActivityData.js`,
    'user_activities',
    '',
    { user: 'admin', password: 'admin-test' }
  );
  await createMockFile(`${__dirname}/mockRawSettingsData.js`, 'settings');
  console.log(chalk.green('\nThe mock data has been updated!\n'));
}

async function checkSnapshots() {
  console.log('Checking mock data.');

  let results = [];

  results.push(
    await checkMockFile(`${__dirname}/mockRawInterestData.js`, 'interests')
  );
  results.push(
    await checkMockFile(`${__dirname}/mockRawDepartmentData.js`, 'departments')
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawServiceData.js`,
      'services',
      '&exists[archivedDateTime]=false'
    )
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawArchivedServiceData.js`,
      'services',
      '&exists[archivedDateTime]=true'
    )
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawServiceDraftData.js`,
      'service_drafts'
    )
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawServiceHistoryData.js`,
      'service_histories'
    )
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawServiceActivityData.js`,
      'service_activities',
      '',
      { user: 'admin', password: 'admin-test' }
    )
  );
  results.push(
    await checkMockFile(
      `${__dirname}/mockRawUserActivityData.js`,
      'user_activities',
      '',
      { user: 'admin', password: 'admin-test' }
    )
  );
  results.push(
    await checkMockFile(`${__dirname}/mockRawSettingsData.js`, 'settings')
  );

  let errors = results.filter(s => s !== null);
  if (errors.length > 0) {
    throw errors.join('\n');
  }

  console.log(chalk.green('\nThe mock data matches!\n'));
}

(async function() {
  try {
    process.argv.includes('--check')
      ? await checkSnapshots()
      : await updateSnapshots();
    process.exit();
  } catch (error) {
    console.error(chalk.red(`\n${error.message}\n${error.stack}\n`));
    process.exit(1);
  }
})();
