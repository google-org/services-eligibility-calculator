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

#
# Installs a Drupal deploy bundle (e.g. one of deploy/drupal_*.tar.gz).

BUNDLE=''

function usage() {
  echo 'Installs a Drupal deploy bundle.'
  echo ''
  echo './install.sh {-h|--help} --bundle=drupal_{env}_v0.0.0.tar.gz' 
  echo ''
}


function yesno() {
  echo
  echo -n "$1 [y/n] "
  while read -n 1 -r; do
    echo
    case "$REPLY" in
      [Yy])
        return 0
        ;;
      [Nn])
        return 1
        ;;
      *)
        echo -n "Invalid selection. Please enter 'y' or 'n': "
        ;;
    esac
  done
}

while [ "$1" != "" ]; do
  PARAM=`echo $1 | awk -F= '{print $1}'`
  VALUE=`echo $1 | awk -F= '{print $2}'`
  case $PARAM in
    -h | --help)
      usage
      exit
      ;;
    --bundle)
      BUNDLE=$VALUE
      ;;
    *)
      echo "ERROR: unknown parameter \"$PARAM\""
      usage
      exit 1
      ;;
  esac
  shift
done

if [ "$BUNDLE" == '' ]; then
  echo '--bundle is required'
  exit
fi

echo ''
echo "Installing $BUNDLE ..."

REINSTALL="n"
if [[ "$(vendor/bin/drush core:status --field bootstrap)" == 'Successful' ]]; then
  REINSTALL="y"
else
  if ! yesno "It looks like this is the first install. Is that correct?"; then
    echo
    echo "An existing Drupal installation was not found."
    echo "You may not have DATABASE_URL configured properly,"
    echo "or the database may be offline or inaccessible. Aborting."
    echo
    exit 1
  fi
fi

# Extract Bundle
echo "Unpacking $BUNDLE ..."
tar -xvf $BUNDLE
echo

if [[ "$REINSTALL" != "y" ]]; then
  echo "Initializing Drupal environment..."
  vendor/bin/drush site:install --existing-config --no-interaction -v
else
  echo "Updating Drupal environment..."
  MAINTENANCE="n"
  if yesno "Put site into maintenance mode while updating (recommended)?"; then
    MAINTENANCE="y"
    echo "Entering maintenance mode and rebuilding cache..."
    vendor/bin/drush state:set system.maintenance_mode TRUE -v
    vendor/bin/drush cache:rebuild -v
  fi
  echo "Importing updated site configuration..."
  vendor/bin/drush config:import -v
  if [[ "$MAINTENANCE" == "y" ]]; then
    echo "Leaving maintenance mode and rebuilding cache..."
    vendor/bin/drush state:set system.maintenance_mode FALSE -v
    vendor/bin/drush cache:rebuild -v
  fi
fi

echo "Granting ${WWW_OWNER:=apache} permissions on Drupal site files..."
chown -R ${WWW_OWNER}:${WWW_OWNER} web/sites/default/files

# TODO: Automatically add a 'trusted_host_patterns' for the current host to
# web/sites/default/settings.local.php? Or can we assume that is handled
# separately, as part of the web server access control and hosting configs?
