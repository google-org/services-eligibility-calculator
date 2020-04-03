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


namespace App\DataProviders;

use ApiPlatform\Core\DataProvider\ItemDataProviderInterface;
use ApiPlatform\Core\DataProvider\RestrictedDataProviderInterface;
use App\Entity\Metric;
use App\Entity\Service;
use App\Entity\ServiceAnalytics;
use Doctrine\ORM\EntityManagerInterface;

final class ServiceAnalyticsDataProvider implements ItemDataProviderInterface, RestrictedDataProviderInterface
{
    private $analytics;
    private $entityManager;
    private $viewId;

    public function __construct(\Google_Service_AnalyticsReporting $analytics, EntityManagerInterface $entityManager)
    {
        $this->analytics = $analytics;
        $this->entityManager = $entityManager;
    }

    public function setViewId(string $viewId)
    {
        $this->viewId = $viewId;
    }

    public function supports(string $resourceClass, string $operationName = null, array $context = []): bool
    {
        return ServiceAnalytics::class === $resourceClass;
    }

    private static function base64_encode_url($string)
    {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($string));
    }

    public function getItem(string $resourceClass, $id, string $operationName = null, array $context = []): ?ServiceAnalytics
    {
        // Verify the service exists before retrieving analytics.
        $service = $this->entityManager->find(get_class(new Service()), $id);
        if (!$service) {
            return null;
        }

        // Create the DateRange objects for the last 30 days, and the 30 days prior to that.
        $last30days = new \Google_Service_AnalyticsReporting_DateRange();
        $last30days->setStartDate("30daysAgo");
        $last30days->setEndDate("yesterday");

        $previous30days = new \Google_Service_AnalyticsReporting_DateRange();
        $previous30days->setStartDate("60daysAgo");
        $previous30days->setEndDate("31daysAgo");

        // Create the Metrics object.
        $pageviews = new \Google_Service_AnalyticsReporting_Metric();
        $pageviews->setExpression("ga:pageviews");
        $pageviews->setAlias("PageViews");

        // Filter on this service.
        $serviceFilter = new \Google_Service_AnalyticsReporting_DimensionFilter();
        $serviceFilter->setDimensionName("ga:pagePath");
        $serviceFilter->setOperator("EXACT");
        $base64Id = ServiceAnalyticsDataProvider::base64_encode_url("/api/services/$id");
        $serviceFilter->setExpressions("/services/$base64Id");

        $filterClause = new \Google_Service_AnalyticsReporting_DimensionFilterClause();
        $filterClause->setFilters(array($serviceFilter));

        // Create the ReportRequest object for pageviews.
        $pageRequest = new \Google_Service_AnalyticsReporting_ReportRequest();
        $pageRequest->setViewId($this->viewId);
        $pageRequest->setDateRanges([$last30days, $previous30days]);
        $pageRequest->setMetrics(array($pageviews));
        $pageRequest->setDimensionFilterClauses(array($filterClause));

        // Event metrics object.
        $events = new \Google_Service_AnalyticsReporting_Metric();
        $events->setExpression("ga:totalEvents");
        $events->setAlias("totalEvents");

        // Event dimensions objects.
        $eventCategory = new \Google_Service_AnalyticsReporting_Dimension();
        $eventCategory->setName("ga:eventCategory");
        $eventAction = new \Google_Service_AnalyticsReporting_Dimension();
        $eventAction->setName("ga:eventAction");

        // Create the Report Request object for events.
        $eventRequest = new \Google_Service_AnalyticsReporting_ReportRequest();
        $eventRequest->setViewId($this->viewId);
        $eventRequest->setDateRanges([$last30days, $previous30days]);
        $eventRequest->setMetrics(array($events));
        $eventRequest->setDimensions(array($eventCategory, $eventAction));
        $eventRequest->setDimensionFilterClauses(array($filterClause));

        $body = new \Google_Service_AnalyticsReporting_GetReportsRequest();
        $body->setReportRequests(array($pageRequest, $eventRequest));

        return ServiceAnalyticsDataProvider::analyticsFromReports($id, $this->analytics->reports->batchGet($body));
    }

    public static function analyticsFromReports($id, $reports)
    {
        $serviceAnalytics = new ServiceAnalytics();
        $serviceAnalytics->serviceId = $id;

        $pageviews = ServiceAnalyticsDataProvider::processPageviews($reports[0], $id);
        if (sizeof($reports) == 1) {
            // No events returned.
            $metrics = [];
        } else {
            $metrics = ServiceAnalyticsDataProvider::processEvents($reports[1], $id);
        }

        array_push($metrics, $pageviews);
        $serviceAnalytics->metrics = $metrics;

        return $serviceAnalytics;
    }

    private static function processPageViews($report, $id)
    {
        $pageviews = new Metric();
        $pageviews->serviceId = $id;
        $pageviews->name = 'PageViews';
        $pageviews->value = 0;
        $pageviews->trend = 0.;

        $header = $report->getColumnHeader();
        $metricHeaders = $header->getMetricHeader()->getMetricHeaderEntries();

        $rows = $report->getData()->getRows();
        assert(count($rows) == 1 && count($metricHeaders) == 1, "There should be exactly 1 row.");
        if (count($rows) != 1) {
            // No pageviews found.
            return $pageviews;
        }
        $row = $rows[0];

        $header = $metricHeaders[0];
        assert($header->name == "PageViews", "Expecting 'PageViews' got '" . $header->name . "' instead.");

        $metrics = $row->getMetrics();
        assert(count($metrics) == 2, "There should be exactly 2 metrics.");

        $currentValues = $metrics[0]->getValues();
        $priorValues = $metrics[1]->getValues();
        assert(count($currentValues) == 1, "Current metric should have exactly 1 value.");
        assert(count($priorValues) == 1, "Prior metric should have exactly 1 value.");

        $currentValue = $currentValues[0];
        $priorValue = $priorValues[0];

        $pageviews->value = (int) $currentValue;
        if ($priorValue != 0) {
            $pageviews->trend = ($currentValue - $priorValue) * 100. / $priorValue;
        }

        return $pageviews;
    }

    private static function processEvents($report, $id)
    {
        $eventMetrics = [];

        $header = $report->getColumnHeader();
        $metricHeaders = $header->getMetricHeader()->getMetricHeaderEntries();

        $header = $metricHeaders[0];
        assert($header->name == "eventTotals", "Expecting 'eventTotals' got '" . $header->name . "' instead.");

        $rows = $report->getData()->getRows();
        foreach ($rows as $row) {
            $metrics = $row->getMetrics();
            assert(count($metrics) == 2, "There should be exactly 2 metrics.");

            $dimensions = $row->getDimensions();
            assert(count($dimensions) == 2, "There should be exactly 2 dimensions.");
            $eventCategory = $dimensions[0];
            $eventAction = $dimensions[1];

            if ($eventCategory == "Click") {
                $currentValues = $metrics[0]->getValues();
                $priorValues = $metrics[1]->getValues();
                assert(count($currentValues) == 1, "Current metric should have exactly 1 value.");
                assert(count($priorValues) == 1, "Prior metric should have exactly 1 value.");

                $currentValue = $currentValues[0];
                $priorValue = $priorValues[0];

                $eventMetric = new Metric();
                $eventMetric->serviceId = $id;
                $eventMetric->name = $eventAction;
                $eventMetric->trend = 0.;

                $eventMetric->value = (int) $currentValue;
                if ($priorValue != 0) {
                    $eventMetric->trend = ($currentValue - $priorValue) * 100. / $priorValue;
                }

                array_push($eventMetrics, $eventMetric);
            }
        }

        return $eventMetrics;
    }
}
