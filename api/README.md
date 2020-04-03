This api was created using [Api Platform](https://api-platform.com/).

## Available Scripts

In the api directory, you can run:

### `php bin/console`

Lists all available console commands. Common commands are described below.

### `php bin/console server:start`

Starts a local webserver serving the api w/documentation at http://localhost:8000/api as a background task.

### `php bin/console server:stop`

Stops the local webserver.

### `php bin/console server:run`

Starts a local webserver serving the api w/documentation at http://localhost:8000/api as a foreground task (end with CTRL-C).

### `php bin/console cache:clear`

Clears the local [symfony cache](https://symfony.com/doc/current/cache.html).

### `php bin/console doctrine:schema:update`

Updates the local db with the latest schema changes.

### `composer test`

Launches the phpunit test runner, running all the tests in the tests
directory.

**NOTE**: This operation is destructive to the local db, as
it resets the db to a known state for testing.

## Authentication

Authentication is handled using jwt tokens between the client and api. A username/password is provided to the api/login end-point and a jwt token
is returned on successful login.

In the dev environment, there are two [in-memory users](packages/dev/security.yaml) available (username: password):

- user: user-test
- admin: admin-test

In the prod environment, an ldap server is used to authenticate users specified by the LDAP\_\* environment variables (see [.env](.env)). These should be overriden to
your own ldap server using an .env.local file.

See also [Symfony Security](https://symfony.com/doc/current/security.html) for alternative options available.

## Learn More

You can learn more in the [Api Platform documentation](https://api-platform.com/) and the [Symfony documentation](https://symfony.com/doc/).
