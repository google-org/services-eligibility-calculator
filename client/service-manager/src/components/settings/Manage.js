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

import AreaMedianIncome from './AreaMediaIncome';
import { List as DepartmentList } from '../department';
import FederalPovertyLevel from './FederalPovertyLevel';
import Header from './Header';
import InfoBanner from './InfoBanner';
import { List as InterestList } from '../interest';
import React from 'react';

export default function Manage() {
  return (
    <>
      <Header tab="Service management" />
      <DepartmentList></DepartmentList>
      <InterestList></InterestList>
      <AreaMedianIncome></AreaMedianIncome>
      <FederalPovertyLevel></FederalPovertyLevel>
      <InfoBanner></InfoBanner>
    </>
  );
}
