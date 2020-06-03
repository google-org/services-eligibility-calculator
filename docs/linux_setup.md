# Setup on Linux Workstation

The steps outlined below were known to work on 15 October 2019 … some versions may have changed if you are reading this in the future :).

## Apache

```
# Make sure your local package index is up to date:
sudo apt-get update

# Install Apache:
sudo apt-get install apache2

# Install PHP and extensions you may need:
sudo apt-get install libapache2-mod-php7.3
sudo apt-get install php7.3-mysql
sudo apt-get install php7.3-ldap
sudo apt-get install php7.3-intl

# Install composer for managing php dependencies:
sudo apt-get install composer

# Start Apache:
sudo /etc/init.d/apache2 start

# View your site!
xdg-open http://localhost/
```

The default install serves up files from `/var/www/html`.

## PHP

```
sudo apt-get install php php-xml
```

## Using PHP’s built-in webserver (in lieu of Apache)

PHP provides a built-in web server that can be used for testing purposes / development. See [https://www.php.net/manual/en/features.commandline.webserver.php](https://www.php.net/manual/en/features.commandline.webserver.php) for all the nitty gritty details.

TL;DR

```
xdg-open http://localhost:8000/ & php -S localhost:8000 -t <path to your php files>
```

## mysql

```
# Install MySQL:
sudo apt-get install default-mysql-server
# Start mysql:
sudo /etc/init.d/mysql start
```

Note that the above installs MariaDB (the default on debian). You can use the mysql cli as root using sudo:

```
sudo mysql
```

## NodeJS

```
# Install NodeJS:
sudo apt-get install nodejs
```

If this package fails to resolve, install it [from nodejs.org](https://nodejs.org/en/).

## Xdebug

Xdebug can be used to debug php. First, install (see also [https://xdebug.org/docs/install](https://xdebug.org/docs/install)):

```
sudo apt-get install php7.3-dev
sudo pecl install xdebug
```

Ensure your php.ini loads xdebug, for example:

```
sudo sh -c 'echo "zend_extension=/usr/lib/php/20180731/xdebug.so" > /etc/php/7.3/mods-available/xdebug.ini'
sudo ln -s /etc/php/7.3/mods-available/xdebug.ini /etc/php/7.3/apache2/conf.d/20-xdebug.ini
sudo ln -s /etc/php/7.3/mods-available/xdebug.ini /etc/php/7.3/cli/conf.d/20-xdebug.ini
```

Enable remote debugging by adding the following lines to xdebug.ini:

```
[XDebug]
xdebug.remote_enable = 1
xdebug.remote_autostart = 1
```

## Shutting Things Down

```
sudo /etc/init.d/apache2 stop
sudo /etc/init.d/mysql stop
```

## Restarting

```
sudo /etc/init.d/apache2 restart
sudo /etc/init.d/mysql restart
```

# Api Platform

[https://api-platform.com/](https://api-platform.com/)

## Initial Setup

From the base api directory, use [composer](https://getcomposer.org/doc/01-basic-usage.md) to install / download all dependencies:

```
# Install composer for managing php dependencies (if not yet installed)
sudo apt-get install composer

# Install all dependencies
cd api
composer install

# Ensure bin/console can be executed
chmod +x bin/console
```

## Configuring your Local Database

[https://symfony.com/doc/current/doctrine.html#configuring-the-database](https://symfony.com/doc/current/doctrine.html#configuring-the-database)

First create the user in your mysql instance, granting all privileges:

```
CREATE USER 'services_rw'@'localhost' IDENTIFIED WITH mysql_native_password BY 'services_dev_pw';
GRANT ALL PRIVILEGES ON *.* TO 'services_rw'@'localhost';
```

Create the database and schema for the user:

```
bin/console doctrine:database:create
bin/console doctrine:schema:create
```

Minimize the privileges for the user to just the services database:

```
REVOKE ALL PRIVILEGES ON *.* FROM 'services_rw'@'localhost';
GRANT ALL PRIVILEGES ON services.* TO 'services_rw'@'localhost';
```

Start a local server for testing:

```
bin/console server:start
```

You can now view/use the API at [http://localhost:8000/api](http://localhost:8000/api)

Stop the local server:

```
bin/console server:stop
```

## Setting Timezone to UTC

For consistency in our mock data, you’ll need to set the timezone used in php and mysql to UTC.

### For mysql database

1.  Create /etc/my.cnf (if doesn’t exist) and add:

    ```
    [mysqld]
    default-time-zone='+00:00'
    ```

2.  Restart database:

    ```
    sudo /etc/init.d/mysql restart
    ```

3.  Verify that the timezone is set:

    ```
    sudo mysql
    > select @@global.time_zone;
    ```

### For PHP server

1.  Edit `/etc/php/7.3/cli/php.ini`, find this line & uncomment:

    ```
    ; Defines the default timezone used by the date functions
    ; http://php.net/date.timezone
    date.timezone = UTC
    ```

2.  Restart local API server (bin/console server:stop/start)

## Running Tests

You’ll need to override the `.env.test` database connection to point to your local database for testing. Do this by creating an `.env.test.local` file with the following contents:

```
DATABASE_URL=mysql://services_rw:services_dev_pw@127.0.0.1:3306/services
```

You can now run all the test locally using the following command:

```
composer test
```
