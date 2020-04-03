# Testing Utilities

This folder contains the `updateMockData.js` utility alongside perviously serialized mock data. This data is fetched from the API after the database is refreshed with templated test data via `composer test`. The fetched data is then serialized as files in this folder to be used in jest tests for the service manager and calculator. These tests are run via `npm test` in their respective folders.

Nondeterministic data in the responses are replaced with deterministic data to ensure test reliability.

## `npm run update-mocks`

Updates the mocks used in `npm test` based on the data in the API.
Ensure that the API is running at `localhost:8000` and that `composer test` has been run to refresh the data.

Run this command from `client/service-manager`.

## `npm run check-mocks`

Verifies the mocks used in `npm test` against the data in the API.
Ensure that the API is running at `localhost:8000` and that `composer test` has been run to refresh the data.

Run this command from `client/service-manager`.
