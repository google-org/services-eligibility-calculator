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
# Installs a deploy bundle (e.g. one of deploy/*.tar.gz).

BUNDLE=''

function usage()
{
    echo 'Installs a deploy bundle.'
    echo ''
    echo './install.sh {-h|--help} --bundle={env}_v0.0.0.tar.gz' 
    echo ''
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
echo ''

read -p "Update jwt public/private keys? " -n 1 -r
echo ''
mkdir -p tmp_config_jwt
rm -rf tmp_config_jwt/*
mv config/jwt/*.pem tmp_config_jwt/
if [[ $REPLY =~ ^[Yy]$ ]]
then
  export JWT_PASSPHRASE=`grep JWT_PASSPHRASE .env.local | cut -d "=" -f 2`
  echo "Generating primary key using JWT_PASSPRHASE defined in '.env.local'"
  openssl genpkey -out tmp_config_jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:$JWT_PASSPHRASE
  openssl pkey -in tmp_config_jwt/private.pem -out tmp_config_jwt/public.pem -pubout -passin pass:$JWT_PASSPHRASE
else  
  echo 'Using same JWT public/private keys as before.'
fi

cmd='rm -rf bin composer.json composer.lock config phpunit.xml.dist public README.md src symfony.lock templates vendor'
echo 'Deleting previous version (may cause the site to go down during the update):'
echo $cmd

read -p "Are you sure? " -n 1 -r
echo ''
if [[ $REPLY =~ ^[Yy]$ ]]
then
  eval $cmd

  echo "Unpacking $BUNDLE ..."
  tar -xvf $BUNDLE

  echo "Moving JWT public/private keys to config/jwt ..."
  mkdir -p config/jwt
  mv tmp_config_jwt/* config/jwt
  rm -rf tmp_config_jwt

  echo 'Clearing and warming up backend cache ...'
  APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear
  # Ensure cache is rw to both user and group.
  find var/cache/ \( -type d -exec chmod -f 771 {} \; \) -o \( -type f -exec chmod -f 660 {} \; \)

  echo "Checking if database is up-to-date ..."
  APP_ENV=prod APP_DEBUG=0 php bin/console doctrine:schema:update

  echo ''
  echo "Install of $BUNDLE complete."
  echo ''
else
  echo 'oops'  
fi
