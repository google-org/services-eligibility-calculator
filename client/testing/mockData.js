/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { services as mockArchivedServices } from './mockRawArchivedServiceData';
import { departments as mockDepartments } from './mockRawDepartmentData';
import { interests as mockInterests } from './mockRawInterestData';
import { service_activities as mockServiceActivities } from './mockRawServiceActivityData';
import { serviceAnalytics as mockServiceAnalytics } from './mockRawServiceAnalyticsData';
import { service_drafts as mockServiceDrafts } from './mockRawServiceDraftData';
import { service_histories as mockServiceHistories } from './mockRawServiceHistoryData';
import { services as mockServices } from './mockRawServiceData';
import { settings as mockSettings } from './mockRawSettingsData';
import { user_activities as mockUserActivities } from './mockRawUserActivityData';

export {
  mockServices,
  mockSettings,
  mockArchivedServices,
  mockServiceDrafts,
  mockInterests,
  mockDepartments,
  mockServiceActivities,
  mockServiceAnalytics,
  mockServiceHistories,
  mockUserActivities
};

export const mockServicesJson = JSON.stringify(mockServices);
export const mockSettingsJson = JSON.stringify(mockSettings);
export const mockArchivedServicesJson = JSON.stringify(mockArchivedServices);
export const mockServiceDraftsJson = JSON.stringify(mockServiceDrafts);
export const mockInterestsJson = JSON.stringify(mockInterests);
export const mockDepartmentsJson = JSON.stringify(mockDepartments);
export const mockServiceAnalyticsJson = JSON.stringify(mockServiceAnalytics);
export const mockServiceActivitiesJson = JSON.stringify(mockServiceActivities);
export const mockUserActivitiesJson = JSON.stringify(mockUserActivities);

export const mockService = mockServices['hydra:member'][0];
export const mockServiceJson = JSON.stringify(mockService);

export const mockServiceDraft = mockServiceDrafts['hydra:member'][1];
export const mockServiceDraftJson = JSON.stringify(mockServiceDraft);

export const mockInterest = mockInterests['hydra:member'][0];
export const mockInterestJson = JSON.stringify(mockInterest);

export const mockDepartment = mockDepartments['hydra:member'][0];
export const mockDepartmentJson = JSON.stringify(mockDepartment);
