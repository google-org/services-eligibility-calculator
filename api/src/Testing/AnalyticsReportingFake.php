<?php
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

declare (strict_types = 1);

namespace App\Testing;

use Google_Service_AnalyticsReporting_Resource_Reports;

/**
 * Fake implementation of Google_Service_AnalyticsReporting_Resource_Reports for testing.
 */
class AnalyticsReporting_Resource_ReportsFake extends Google_Service_AnalyticsReporting_Resource_Reports
{
    private $response;

    /**
     * Returns the Analytics data. (reports.batchGet)
     *
     * @param Google_Service_AnalyticsReporting_GetReportsRequest $postBody
     * @param array $optParams Optional parameters.
     * @return Google_Service_AnalyticsReporting_GetReportsResponse
     */
    public function batchGet(\Google_Service_AnalyticsReporting_GetReportsRequest $postBody, $optParams = array())
    {
        return $this->response ? $this->response : new \Google_Service_AnalyticsReporting_GetReportsResponse();
    }

    /**
     * Specify the metrics to be returned from batchGet.
     *
     * @param array $metrics key => array(value) pairs of metrics to be returned.
     */
    public function withMetrics($metrics)
    {
        $headerEntries = array();
        $orderedValues = array();
        foreach ($metrics as $key => $values) {
            $headerEntry = new \Google_Service_AnalyticsReporting_MetricHeaderEntry();
            $headerEntry->setName($key);
            array_push($headerEntries, $headerEntry);

            for ($i = 0; $i < count($values); $i++) {
                $value = $values[$i];
                if (count($orderedValues) < $i + 1) {
                    array_push($orderedValues, array($value));
                } else {
                    array_push($orderedValues[$i], $value);
                }
            }
        }

        $metricValues = array();
        foreach ($orderedValues as $values) {
            $metric = new \Google_Service_AnalyticsReporting_DateRangeValues();
            $metric->setValues($values);
            array_push($metricValues, $metric);
        }

        $metricHeader = new \Google_Service_AnalyticsReporting_MetricHeader();
        $metricHeader->setMetricHeaderEntries($headerEntries);

        $header = new \Google_Service_AnalyticsReporting_ColumnHeader();
        $header->setMetricHeader($metricHeader);

        $row = new \Google_Service_AnalyticsReporting_ReportRow();
        $row->setMetrics($metricValues);

        $data = new \Google_Service_AnalyticsReporting_ReportData();
        $data->setRows(array($row));

        $report = new \Google_Service_AnalyticsReporting_Report();
        $report->setColumnHeader($header);
        $report->setData($data);

        $response = $this->response ? $this->response : new \Google_Service_AnalyticsReporting_GetReportsResponse();
        $reports = $response->getReports() ? $response->getReports() : [];
        array_push($reports, $report);
        $response->setReports($reports);

        $this->response = $response;

        return $this;
    }

    /**
     * Specify the events to be returned from batchGet.
     *
     * @param array $events key => array(value) pairs of event data to be returned.
     */
    public function withEvents($events)
    {
        $headerEntries = array();
        $headerEntry = new \Google_Service_AnalyticsReporting_MetricHeaderEntry();
        $headerEntry->setName('eventTotals');
        array_push($headerEntries, $headerEntry);

        $metricHeader = new \Google_Service_AnalyticsReporting_MetricHeader();
        $metricHeader->setMetricHeaderEntries($headerEntries);

        $header = new \Google_Service_AnalyticsReporting_ColumnHeader();
        $header->setMetricHeader($metricHeader);

        $rows = array();
        foreach ($events as $event => $values) {
            $orderedValues = array();
            for ($i = 0; $i < count($values); $i++) {
                $value = $values[$i];
                if (count($orderedValues) < $i + 1) {
                    array_push($orderedValues, array($value));
                } else {
                    array_push($orderedValues[$i], $value);
                }
            }

            $metricValues = array();
            foreach ($orderedValues as $values) {
                $metric = new \Google_Service_AnalyticsReporting_DateRangeValues();
                $metric->setValues($values);
                array_push($metricValues, $metric);
            }

            $row = new \Google_Service_AnalyticsReporting_ReportRow();
            $row->setMetrics($metricValues);
            $row->setDimensions(['Click', $event]);

            array_push($rows, $row);
        }

        $data = new \Google_Service_AnalyticsReporting_ReportData();
        $data->setRows($rows);

        $report = new \Google_Service_AnalyticsReporting_Report();
        $report->setColumnHeader($header);
        $report->setData($data);

        $response = $this->response ? $this->response : new \Google_Service_AnalyticsReporting_GetReportsResponse();
        $reports = $response->getReports() ? $response->getReports() : [];
        array_push($reports, $report);
        $response->setReports($reports);

        $this->response = $response;

        return $this;
    }
}

/**
 * Fake implementation of Google_Service_AnalyticsReporting.
 */
class AnalyticsReportingFake extends \Google_Service_AnalyticsReporting
{
    public function __construct()
    {
        parent::__construct(new \Google_Client());

        $this->reports = new AnalyticsReporting_Resource_ReportsFake(
            $this,
            $this->serviceName,
            'reports',
            array(
                'methods' => array(
                    'batchGet' => array(
                        'path' => 'v4/reports:batchGet',
                        'httpMethod' => 'POST',
                        'parameters' => array(),
                    ),
                ),
            )
        );}
}
