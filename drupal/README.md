# Composer-based Drupal Configuration.

## Overview

The Drupal backend is implemented as a custom module, which can be found in the
[web/modules/custom/services_manager](web/modules/custom/services_manager) directory.
If you have an existing Drupal installation, that directory is all you need,
and you can install it to your `web/modules` directory like any other
third-party module. To import data from the standalone backend, skip to the
[Migration](#Migration) section below.

The rest of this directory provides a minimal Drupal configuration (basically
just a wrapper around the Services Manager module) which can be used to quickly
setup a simple Drupal environment for developing and testing the module.

This Drupal configuration is based on
[drupal/recommended-project](https://www.drupal.org/node/3082474), with the
following modifications:

* Updated `settings.php` to:
  * [workaround a known file permission issue](https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-troubleshooting-permission-issues-prevent-running-composer)
  * Support various database backends (more info below).
  * Setup a sync directory for sharing configs.
  * Enabled personalized settings with `.env` files and `settings.local.php`.
* Removed some unnecessary post-install messaging from composer.json.


## Demo Drupal Install

To install the base Drupal environment in this directory, run:

```bash
sudo apt-get update
sudo apt-get install php-gd php-curl php-sqlite3
composer install
```

## Demo Setup
A custom site configuration, loosely based on the built-in "standard" profile,
is checked into the repo. To install a clean site based on the saved
configuration:
```bash
rm -rf web/sites/default/files
vendor/bin/drush site:install --account-name=admin --account-pass=admin --no-interaction -v cob_standard
```

Then run the server with:
```bash
export HOST=localhost
export PORT=8080
cd web
php core/scripts/drupal server --host $HOST --port $PORT --suppress-login -v
```

and connect to `http://localhost:8080` and login with user and password `admin`.

The default install uses a local sqlite database. Set the `DATABASE_URL`
environment variable to use an alternative database backend, where
`DATABASE_URL` is something like:
```bash
export DATABASE_URL=mysql://services_rw:services_dev_pw@127.0.0.1:3306/drupal
```

NOTE: This assumes you've already created an empty database and granted the
necessary permissions to create tables and data, like:
```bash
sudo mysql <<EOF
CREATE DATABASE drupal;
GRANT ALL PRIVILEGES ON drupal.* TO 'services_rw'@'localhost';
EOF
```

You can also add this (and other local environment settings) to a `.env` file
in the root of the Drupal install. See `.env.example` for more info.

To share local configuration updates with other users or servers, run:
```bash
vendor/bin/drush config:export -y
```

If these changes should be applied to new installs, commit the updated profile
config files to git. To apply the changes to existing installs, copy your
"active" config files from the `config_sync` directory to the `config_sync`
directory of the target Drupal installation, then apply them like:
```bash
vendor/bin/drush state:set system.maintenance_mode TRUE
vendor/bin/drush cache:rebuild
vendor/bin/drush config:import
vendor/bin/drush state:set system.maintenance_mode FALSE
vendor/bin/drush cache:rebuild
```

You might also want to add the following to `web/sites/default/settings.local.php` to
get rid of a warning in the Drupal configuration UI:

```
<?php
$settings['trusted_host_patterns'] = [
  '^localhost$',
];
```
(and then make the file read-only, so Drupal doesn't start warning about unsafe
file permissions).

NOTE: See `web/sites/default/settings.php` for other settings you might want to
override in `settings.local.php`, such as LDAP server configuration.


## Migration

The Services Manager module provides migration configurations to help import
and synchronize the data created by the standalone Service Manager client and
API-Platform backend.

To get started, you must define a `migrate` database in your Drupal
configuration. The demo Drupal environment provides an example in its
[settings.php](web/sites/default/settings.php). If using the demo environment, create a
`STANDALONE_DATABASE_URL` environment variable pointing to the standalone
backend's SQL database (this should be similar to the `DATABASE_URL` syntax
described above, like
`mysql://services_rw:services_dev_pw@127.0.0.1:3306/standalone`). For exising
Drupal installs, or for other ways to configure database connections, please
see the [Drupal Database
API](https://www.drupal.org/docs/8/api/database-api/database-configuration)
documention.

Once the database connections are configured, run the following from your Drupal directory:

```
vendor/bin/drush migrate:import --all
```

This should automatically import all the standalone data into appropriate
Drupal content. You can also run the imports individually, but be aware that
some of them must be run in a specific order (for instance, `services` must be
imported before `services_translations`, since the latter are "attached" to the
former).

If more changes are made in the standalone database, the corresponding Drupal
data can be updated with:

```
vendor/bin/drush migrate:import --all --update
```

or to remove data that was deleted from the standalone database, run:

```
vendor/bin/drush migrate:import --all --sync
```

More information on migration commands and usage can be found in the [Migrate
API](https://www.drupal.org/docs/8/api/database-api/database-configuration) and
[Migrate Tools](https://www.drupal.org/docs/8/upgrade/upgrade-using-drush)
documentation.
