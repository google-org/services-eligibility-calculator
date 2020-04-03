# Google.org: Service Management & Calculator Portals

_This is not an officially supported Google product._

## Overview

### About the Service Eligibility Calculator

The Service Eligibility Calculator is a simple discovery tool that allows users to filter and browse recommended services by entering information about their household. PII is not saved, but rather the tool filters the full list of services to only display services that match their needs. Filters include:

- How many people / how old are people within their household 
- Personal interests, e.g. childcare, senior services, housing resources, etc. 
- Income 
- Residency within the city limits 

See the [Boulder For Me](https://boulderforme.bouldercolorado.gov) tool for a working implementation of a Service Eligibility Calculator.

### About the Service Manager

The Service Manager is the content management portal for the services populating the Service Eligibility Calculator. This content management portal allows Service Managers - those most familiar with the service-level content - to enter service-specific details so users can more easily learn:

- Service overview
- Qualifications needed for applicants, e.g. income requirements, city residency requirements, etc. 
- What they need to apply
- Timeline for application window
- How to apply when they are ready 

With the most intimate knowledge of the questions their community frequently asks, Service Managers can ensure all of the relevant information is listed to reduce the need for community members to contact multiple city departments.

### About Google.org

[Google.org](https://google.org) works to bring the best of Google to nonprofits and civic entities who are tackling the world's toughest challenges. The Google.org Fellowship embeds teams of Googlers with expertise in product management, software engineering, user experience, and more with nonprofits or civic entities for up to six months of full time pro-bono work. Fellows and their host nonprofit or civic entity build solutions together, working as a team to ensure the Googlers’ work has a sustained and lasting impact.

## Documentation

This README covers some of the one-time setup and deployment steps to run the code in this repository. Other documentation includes:

- [Technical Design](docs/technical_design.md): Design details for the project.
- [Linux setup](docs/linux_setup.md): LAMP and NPM setup on a Linux machine.
- [Code maintenance](docs/code_maintenance.md): Steps to maintain this project.
- [Drupal setup](drupal/README.md): Setup for a Drupal-based service manager.

## Development Environment

### Windows Specific Development Environment Configuration

Windows requires two specific steps to ensure compatibility with symlinks present in this repository:

- [Enable Developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development#accessing-settings-for-developers)
- Clone repo with [git clone -c core.symlinks=true {url}](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coresymlinks)

Some developers have also found [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about) with Ubuntu to be an effective development environment. If using WSL, be sure to install the necessary dependencies within the linux VM itself.

### Install Dependencies

See also the [Linux setup](docs/linux_setup.md) for instructions on installing and configuring these dependencies on a Linux machine.

- [Git](https://git-scm.com/downloads)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [Apache](https://httpd.apache.org/download.cgi)
- [PHP](https://www.php.net/downloads) (or: https://windows.php.net/download)
- [Composer](https://getcomposer.org/)
- [Node + NPM](https://nodejs.org/)
- [VS Code (optional)](https://code.visualstudio.com/download)

### API

#### Create an application MySQL user

Run the following SQL commands in MySQL and substitute "password" with a password of your choosing.

```sql
CREATE USER 'services_rw'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'services_rw'@'localhost';
```

#### Configure database connection

Create `api/env.local` and `api/env.test.local` with the following contents (substituting "password" with the previously chosen password):

```
DATABASE_URL=mysql://services_rw:password@127.0.0.1:3306/services
```

#### Install dependencies

From `/api` run `composer install`.

#### Initialize the database

From `/api` run `php bin/console doctrine:database:create` followed by `php bin/console doctrine:schema:create` to create the `services` database.

#### Run API tests

Warning: The following API tests are data desctructive. The database will be overwritten with test data.

From `/api` run `composer test`.

#### Start the API

From `/api` run `php bin/console server:run` and navigate to http://localhost:8000/api.

### Service Manager

#### Install dependencies

From `/client/service-manager` run `npm install`.

#### Start the application

From `/client/service-manager` run `npm start` and navigate to http://localhost:3000.

### Service Calculator

#### Install dependencies

From `/client/service-calculator` run `npm install`.

#### Start the application

From `/client/service-calculator` run `npm start` and navigate to http://localhost:3001.

## Deployment

### Create New Deployment Bundle

The first step in deploying a new version is to create a new deploy bundle
using the `deploy.sh` script from a clean git client.

Start from a clean git client, for example:

```bash
git checkout master
git fetch origin
git reset --hard origin/master
git checkout -b new-release
```

#### Version

Create a new deploy bundle, incrementing the patch version number (i.e. if
the current version is v1.0.0, the new version will be v1.0.1):

```bash
./deploy.sh --env=your-deploy-env patch
```

Note: You can replace `patch` with `major` or `minor` to update the major or
minor version number instead.

#### Deploy Environment

The `--env` flag specifies any local environment overrides specific to your deploy environment. This directory should contain the following resources:

- An `.env` file with system environment overrides to be applied during deploy.
- A `public` directory containing any file resources (e.g. favicon and logos) that will be copied into the deployed `public` directories of both the calculator and manager deployments.
- A `locales` directory containing translations and text resources specific to
  your environment.

A sample deploy environment directory can be found at [sample-deploy-env](sample-deploy-env).

#### Drupal

By default, the script creates a bundle of the standalone service manager and
calculator with the API-Platform backend. The `--drupal` flag will create a
bundle of the Drupal backend, with the standalone calculator configured to use
that in place of the API-Platform backend.

#### Source Control

The `deploy.sh` script updates the version, creates a new deploy bundle, and
optionally commits, tags, and pushes the newly versioned bundle to github (must
be [connecting to github with ssh](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) for this to work).

You can now merge the new pull request into master using the normal process.

Alternatively, if no review is required / desired - you can run the
`deploy.sh` script directly from a clean git client at master bypassing a
separate pull request.

### Install Deployment Bundle

Once the deployment bundle is created, you can now install the bundle by
copying it to your own server, and then running the `install.sh` script
(or `drupal/install.sh` for a Drupal deployment).

If this is your first time deploying, you'll need to download the
`install.sh` script from github to your server first.

A windows specific `install.ps1` script also exists for installing using
powershell in windows.

## Heroku

Top-level `app.json`, `Procfile`, `package.json` and `composer.json` files exist for Heroku buildpacks which operate at the root of the repository. Composer specifically lacks the ability to run install related command events without packages to install, so we used another lifecycle event.

### References

- [Procfile](https://devcenter.heroku.com/articles/procfile)
- [app.json](https://devcenter.heroku.com/articles/app-json-schema)
- [Composer Command Events](https://getcomposer.org/doc/articles/scripts.md#command-events)
- [NPM Script Events](https://docs.npmjs.com/misc/scripts#description)
