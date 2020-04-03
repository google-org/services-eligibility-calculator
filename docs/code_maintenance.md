# Project / Code Maintenance

## Overview

The Service Manager and Service Calculator web applications are built on top of commonly used and supported frameworks used in the open source community. These frameworks are under active development, which include security and bug fixes that should be applied to our applications in a timely manner to maintain the integrity of the applications.

The purpose of this document is to help in the planning processes around long term maintenance of these web applications. This document includes the main dependencies and their maintenance requirements.

## Reasons to Upgrade

Below are a few scenarios where upgrading would be advantageous:

### Known Vulnerabilities

Known vulnerabilities are published regularly and can affect dependencies or sub-dependencies of projects. Node projects can be checked for known vulnerabilities by running [`npm audit`](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities). PHP projects can be checked for vulnerabilities by running [`symfony check:security`](https://symfony.com/doc/current/setup.html#checking-security-vulnerabilities).

Be sure to upgrade or eliminate dependencies with known vulnerabilities.

### Support

Many dependencies may have limited support options for older versions. Upgrading may be required for compatibility, support or bug fixes.

### New Features

While adding new functionality, it may be advantageous to use features available in more recent releases of a dependency.

## PHP Backend

The services REST API is written in PHP.

Project dependencies for the PHP code are managed using [composer](https://getcomposer.org/). See composer documentation for upgrading dependencies to their latest versions [here](https://getcomposer.org/doc/01-basic-usage.md#updating-dependencies-to-their-latest-versions). The current list of all PHP dependencies for the REST API can be found by examining the [composer.json](https://github.com/cityofboulder/Google.org_Fellowship/blob/master/api/composer.json) file in the repository. The primary dependencies (see [composer.json](https://github.com/cityofboulder/Google.org_Fellowship/blob/master/api/composer.json) for an exhaustive list) the REST API is built on are the following:

- [PHP](https://www.php.net/)
- [MariaDB](https://mariadb.org/) (or just [mysql](https://www.mysql.com/))
- [Symfony](https://symfony.com/) - PHP framework (note: this is the same framework [Drupal is built on](https://symfony.com/projects/drupal)).
- [API Platform](https://api-platform.com/) - Services REST API, Api Platform is built on top of Symfony, and uses Doctrine for interacting with the underlying mysql database.

Each of these dependencies follow the [Semantic Versioning](https://semver.org/) strategy.

### PHP

The PHP supported versions are documented here:

[https://www.php.net/supported-versions.php](https://www.php.net/supported-versions.php)

To summarize:

- Each new release is typically supported for 2 years with active support, and an additional third year with security fixes.
- Upgrade details are documented here: [https://www.php.net/manual/en/appendices.php](https://www.php.net/manual/en/appendices.php)

### MariaDB

The MariaDB maintenance policy is documented here:

[https://mariadb.org/about/#maintenance-policy](https://mariadb.org/about/#maintenance-policy)

To summarize:

- The MariaDB Foundation guarantees that every release will be maintained for at least 5 years.
- Security patches will be created as soon as possible after any security issues are discovered and should be applied as soon as possible.
- Upgrading details are documented here: [https://mariadb.com/kb/en/library/upgrading/](https://mariadb.com/kb/en/library/upgrading/)

### Symfony

The Symfony release process is documented here:

[https://symfony.com/doc/current/contributing/community/releases.html](https://symfony.com/doc/current/contributing/community/releases.html)

To summarize:

- Patch releases come out monthly (should be safe to upgrade).
- Minor releases come out every six months (should be safe to upgrade).
- Major versions come out every two years and may contain breaking changes requiring code changes to your application.

You can [subscribe to symfony roadmap notifications](https://symfony.com/account) to receive an email when a new Symfony version is published or when a Symfony version reaches end of life.

### API Platform

The API Platform release process is documented here:

[https://api-platform.com/docs/extra/releases/](https://api-platform.com/docs/extra/releases/)

To summarize:

- API Platform releases are released “when ready”

You can view releases on api-platform’s github repository:

[https://github.com/api-platform/api-platform/releases](https://github.com/api-platform/api-platform/releases)

In particular it appears that patch releases (i.e. security/bug-fixes) have been coming every few weeks, while minor releases have been coming every six months (approximately).

**IMPORTANT:** API Platform is built on top of Symfony, and as such may require doing symfony upgrades at the same time as API Platform upgrades to keep them in sync.

## Drupal

We have also created a [Drupal](https://www.drupal.org/) module (called Services Manager) that can be used instead of the PHP Backend described above. Drupal provides most of the functionality needed by the module, but it does require a few additional modules to be installed, and some configuration tweaks.

### Drupal 8

This module was built and tested with the latest Drupal 8 release (8.8.4 at the time of this writing) and corresponding modules, and should be compatible with future 8.x releases. No special update maintenance should be required beyond regularly running Drupal's built-in version checks and applying the recommended updates.

The module also tries to avoid any deprecated dependencies, so should also be compatible with Drupal 9 when that is released later this year, but this has not been tested.

### Permissions

The module defines a few custom permissions that can be used to provide varying degrees of access to the service content. The default configuration allows all authenticated users to create and modify services, so you'll probably want to update `admin/people/permissions#module-services_manager` to restict access to whatever groups you have created for that purpose. Also, the view permission is granted to Anonymous Users by default, which is necessary for unauthenticated API access by the public Calculator app.

### Content Translation

The Calculator and Service Manager apps support Spanish language services, so to provide the same functionality in Drupal, and to support importing existing translated content, the core [Content Translation](https://www.drupal.org/docs/8/core/modules/content-translation) module must be enabled and "Spanish" (at least) must be added to the `/admin/config/regional/language` configuration page.

### JSON:API

The core [JSON:API module](https://www.drupal.org/docs/8/modules/jsonapi/jsonapi) provides the API for the Service Calculator frontend. This module requires little configuration of its own, but to properly handle queries for translated content from the frontend, the "Browser" detection method must be enabled on the /`admin/config/regional/language/detection` configuration page.

### Paragraphs

The [Paragraphs](https://www.drupal.org/project/paragraphs) module is an add-on which can be installed with:

```
composer require 'drupal/paragraphs:^1.11'
```

The Services Manager module will automatically add the "Eligibility Profile" Paragraph type, which is used in the Services forms, and no additional configuration should be required.

### Migrate Tools

The [Migrate Tools](https://www.drupal.org/project/migrate_tools) module is an add-on that provides additional functionality for Drupal's [Migrate API](https://www.drupal.org/docs/8/api/migrate-api/migrate-api-overview), and is used by the Service Manager migration configs. It can be installed with:

```
composer require 'drupal/migrate_tools:^4.5'
```

### Field Group

The Field Group module is an add-on used by the Service Manager forms, and requires no additional configuration. It can be installed with:

```
composer require 'drupal/field_group:^3.0'
```

## Webapp Frontends

The services web front ends are written with javascript, html, and css using the [React JS libraries](https://reactjs.org/).

Project dependencies for the frontend code are managed using [npm](https://docs.npmjs.com/about-npm/). Updating dependencies using npm are documented [here](https://docs.npmjs.com/cli/update.html). The current list of all react/javascript dependencies can be found by examining the [package.json](https://github.com/cityofboulder/Google.org_Fellowship/search?q=filename%3Apackage.json) files in the repository (e.g. the [service-manager package.json file](https://github.com/cityofboulder/Google.org_Fellowship/blob/master/service-manager/react-client/package.json)). The primary dependencies for the frontend code (again see the [package.json](https://github.com/cityofboulder/Google.org_Fellowship/search?q=filename%3Apackage.json) files for an exhaustive list) are the following:

- [React](reactjs.com) - Multiple javascript libraries for building web frontends.
- [Bootstrap](https://getbootstrap.com/) - Libraries used for layout / styling of the web frontend.

### React

React release process is documented here:

[https://reactjs.org/docs/faq-versioning.html](https://reactjs.org/docs/faq-versioning.html)

To summarize:

- Critical bug fixes are released in patches and should be applied as soon as possible.
- New features / non-critical bug fixes are released in minor releases (not required).
- Breaking changes come in major releases (not required), these have come every 1 to 2 years.

### Bootstrap

We are using the v4.x version of Bootstrap. Here is a list of all the Bootstrap versions:

[https://getbootstrap.com/docs/versions/](https://getbootstrap.com/docs/versions/)

There does not appear to be a strong reason / requirement for upgrading to newer versions of Bootstrap over time as a matter of course given our usage primarily as a layout / styling library. If upgrades are made, care should be taken to ensure layout and styling of the web application is not adversely affected.

## Translation

Service names / descriptions / eligibility will be provided in both English and Spanish. Whenever services are added or modified, new Spanish translations will need to be added.

Translations are managed within the Service Manager itself. See the user’s guide for more details.

## Migration to Drupal

Please see the [Drupal README](../drupal/README.md#Migration).
