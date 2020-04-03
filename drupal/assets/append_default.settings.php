// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * ---------------------
 * Start Custom Config
 * ---------------------
 */


// The following works around permission issues with Composer-based installs. See also
// https://www.drupal.org/docs/develop/using-composer/starting-a-site-using-drupal-composer-project-templates#s-workaround
// https://www.drupal.org/project/drupal/issues/3091285
$settings['skip_permissions_hardening'] = TRUE;

// Read and apply DB settings if available, otherwise use the sqlite default.
if (getenv('DATABASE_URL')) {
  $dbopts = parse_url(getenv('DATABASE_URL'));
  $databases['default']['default'] = array(
    'database' => ltrim($dbopts['path'], '/'),
    'username' => $dbopts['user'],
    'password' => $dbopts['pass'],
    'prefix' => '',
    'host' => $dbopts['host'],
    'port' => $dbopts['port'],
    'namespace' => $dbopts['scheme'] === 'postgres' ?
        'Drupal\\Core\\Database\\Driver\\pgsql' :
        'Drupal\\Core\\Database\\Driver\\mysql',
    'driver' => $dbopts['scheme'] === 'postgres' ? 'pgsql' : 'mysql',
  );
} else {
  $databases['default']['default'] = array (
    'database' => 'sites/default/files/.sqlite',
    'prefix' => '',
    'namespace' => 'Drupal\\Core\\Database\\Driver\\sqlite',
    'driver' => 'sqlite',
  );
}

// Settings for migrating data from the standalone backend.
if (getenv('STANDALONE_DATABASE_URL')) {
  $standalone_dbopts = parse_url(getenv('STANDALONE_DATABASE_URL'));
  $databases['migrate']['default'] = array (
    'database' => ltrim($standalone_dbopts['path'], '/'),
    'username' => $standalone_dbopts['user'],
    'password' => $standalone_dbopts['pass'],
    'prefix' => '',
    'host' => $standalone_dbopts['host'],
    'port' => $standalone_dbopts['port'],
    'namespace' => 'Drupal\\Core\\Database\\Driver\\mysql',
    'driver' => 'mysql',
  );
}

if (getenv('LDAP_SERVERS')) {
  $config['ldap_servers.server.default_ldap_server']['status'] = TRUE;
  $config['ldap_servers.server.default_ldap_server']['address'] = getenv('LDAP_SERVERS');
  $config['ldap_servers.server.default_ldap_server']['port'] = getenv('LDAP_PORT');
  $config['ldap_servers.server.default_ldap_server']['binddn'] = getenv('LDAP_USERNAME');
  $config['ldap_servers.server.default_ldap_server']['bindpw'] = getenv('LDAP_PASSWORD');
  $config['ldap_servers.server.default_ldap_server']['basedn'] = getenv('LDAP_BASE_DN');
  # See ../../../config_sync/ldap_servers.server.default_ldap_server.yml for
  # other server settings that might need to be overridden.
}

$settings['config_sync_directory'] = '../config_sync';

$settings['hash_salt'] = file_get_contents('../assets/salt.txt');

if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}

/**
 * ---------------------
 * End Custom Config
 * ---------------------
 */

