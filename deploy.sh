#!/bin/bash
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Build a depoyable tar.gz file including both client and server code.

function usage()
{
    echo 'Tests, builds, tags, and pushes a new deploy bundle.'
    echo ''
    echo './deploy.sh {-h|--help} {-d|--drupal} {-e|--env=<deploy-env>} [<newversion> | major | minor | patch]'
    echo ''
    echo 'The <newversion> should specify which part of the version'
    echo 'to increment for this new deploy bundle. For example, if the'
    echo 'current version is v1.2.3 and the following command is run:'
    echo ''
    echo './deploy.sh minor'
    echo ''
    echo 'The resulting deploy bundle will have the version: v1.3.0'
    echo ''
    echo 'Pass the "--drupal" flag to deploy the Drupal backend and service manager'
    echo 'instead of the API-Platform backend and standalone service manager.'
    echo ''
    echo 'Pass the "--env" flag to load a deploy environment from the specified'
    echo 'directory <deploy-env-dir>.  The .env file in this directory should contain'
    echo 'any environment variable exports, and all other files in the directory will'
    echo 'be copied into the client public folders (e.g. logos and favicons).'
}

NEWVERSION=''
BACKEND='api'
VERSION_ARGS=''
ENVIRONMENT=''

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        -h | --help)
            usage
            exit
            ;;
        -d | --drupal)
            BACKEND='drupal'
            VERSION_ARGS='--prefix drupal'
            ;;
        -e | --env)
            ENVIRONMENT=$VALUE
            ;;
        major | minor | patch)
            NEWVERSION=$PARAM
            ;;
        *)
            echo "ERROR: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

if [ "$NEWVERSION" == '' ]; then
    usage
    exit
fi

if [ "$ENVIRONMENT" == '' ]; then
    read -p "No environment specified {-e|--env=<deploy-env-dir>}, proceed? " -n 1 -r
    echo ''
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        echo 'Continuing with the default environment.'
    else
        exit
    fi
else
    if [ ! -f "$ENVIRONMENT/.env" ]; then
        echo 'Invalid --env directory - $ENVIRONMENT/.env not found!'
        exit
    fi
fi

# Ensure we are in a clean cilent.
[[ -z "$(git status --porcelain)" ]] || { echo 'git client not clean'; exit 1; }

# Run server (php) tests.
composer install -d ${BACKEND}/
composer test -d ${BACKEND} || { echo 'server tests failed'; exit 1; }

# Start with a clean deploy directory.
rm -rf .deploy

# Run client tests.
cd client/service-calculator/
npm install
CI=true npm test || { echo 'client/service-calculator tests failed'; exit 1; }
cd ../../

# TODO: This only runs the service-manager tests, but it should probably also
# run calculator tests, and maybe backend-specific tests. For now, only do this
# for 'api' deployments, since the service-manager isn't deployed for the
# Drupal backend.
if [[ "$BACKEND" == "api" ]]; then
    cd client/service-manager/
    npm install
    CI=true npm test || { echo 'client/service-manager tests failed'; exit 1; }
    cd ../../
fi

# Set environment for prod deployment.
export APP_ENV=prod
if [ "$ENVIRONMENT" != '' ]; then
  source "$ENVIRONMENT/.env"
fi

# Install/copy server (php) code.
composer install -d ${BACKEND}/ --no-dev --optimize-autoloader
cp -a ${BACKEND}/. .deploy/

# Remove files we do not wish to deploy.
case $BACKEND in
    api)
        rm -rf .deploy/config/jwt
        rm -rf .deploy/fixtures
        rm -rf .deploy/tests
        rm -rf .deploy/var
        rm -rf .deploy/.*.local
        ;;
    drupal)
        rm -f .deploy/.env
        rm -rf .deploy/web/sites/default/files
        rm -f .deploy/web/example.gitignore
        rm -f .deploy/web/INSTALL.txt
        rm -f .deploy/web/README.txt
        rm -f .deploy/web/profiles/README.txt
        rm -f .deploy/web/sites/default/settings.local.php
        rm -f .deploy/web/sites/development.services.yml
        rm -f .deploy/web/sites/example.settings.local.php
        rm -f .deploy/web/sites/example.sites.php
        rm -f .deploy/web/sites/README.txt
        ;;
    *)
        echo "How did we get here?!?!? ($BACKEND)"
        exit 2
        ;;
esac

# Re-install dev server (php) code locally.
composer install -d ${BACKEND}/

if [ "$ENVIRONMENT" != '' ]; then
  rm -rf .deploy.tmp
  mkdir -p .deploy.tmp/locales
  mv client/common/locales .deploy.tmp
  cp -a $ENVIRONMENT/locales client/common 
fi

if [[ "$BACKEND" == "api" ]]; then
  # Install/copy service manager client code.
  export PUBLIC_URL='/manager/'
  export REACT_APP_API_ENDPONT='/api/'
  npm run build --prefix client/service-manager
  cp -a client/service-manager/build/. .deploy/public/manager/
  if [ "$ENVIRONMENT" != '' ]; then
    cp -a $ENVIRONMENT/public/* .deploy/public/manager/
  fi
fi

# Install/copy service calculator client code.
if [[ "$BACKEND" == "api" ]]; then
  export PUBLIC_URL='/'
  export REACT_APP_API_ENDPONT='/api/'
  export DEPLOY_PATH='public'
else
  export PUBLIC_URL='/calculator/'
  export REACT_APP_API_ENDPONT='/jsonapi/'
  export REACT_APP_API_BACKEND='drupal'
  export DEPLOY_PATH='web/sites/calculator'
fi
npm run build --prefix client/service-calculator
cp -a client/service-calculator/build/. .deploy/${DEPLOY_PATH}
if [ "$ENVIRONMENT" != '' ]; then
  cp -a $ENVIRONMENT/public/* .deploy/${DEPLOY_PATH}
  rm -rf client/common/locales
  mv .deploy.tmp/locales client/common
fi

# Update version being deployed.
export APP_VERSION=`npm ${VERSION_ARGS} version ${NEWVERSION} --no-git-tag-version`

# Zip the deployed code.
mkdir -p deploy
cd .deploy
tar -cvzf ../deploy/${BACKEND}_${APP_ENV}_${APP_VERSION}.tar.gz .
cd ..

echo
echo "deployable bundle 'deploy/${BACKEND}_${APP_ENV}_${APP_VERSION}.tar.gz' created"
echo

# Get current local branch name
BRANCH="$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')"
if [[ "$BRANCH" == "master" ]]; then
  echo "NOTE: This will push directly to 'master'. If you want to create a pull request for review,"
  echo "please switch to a different branch before running the deploy script."
fi
# Tag commit / and push.
read -p "Commit, tag, and push ${BACKEND}_${APP_ENV}_${APP_VERSION} to branch ${BRANCH}? " -n 1 -r
echo ''
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ''
    echo "commiting ${BACKEND}_${APP_ENV}_${APP_VERSION}"
    git add package.json package-lock.json drupal/package.json deploy/${BACKEND}_${APP_ENV}_${APP_VERSION}.tar.gz || exit 1;
    git commit -m "${BACKEND}_${APP_ENV}_${APP_VERSION}" || exit 1;

    echo ''
    echo "pushing ${BACKEND}_${APP_ENV}_${APP_VERSION}"
    git push --set-upstream origin ${BRANCH} || exit 1;

    echo ''
    echo "tagging ${BACKEND}_${APP_ENV}_${APP_VERSION}"
    git tag -a ${BACKEND}_${APP_ENV}_${APP_VERSION} -m "${BACKEND}_${APP_ENV}_${APP_VERSION}" || exit 1;

    echo ''
    echo "pushing ${BACKEND}_${APP_ENV}_${APP_VERSION} tag"
    git push origin ${BACKEND}_${APP_ENV}_${APP_VERSION} || exit 1;
fi
