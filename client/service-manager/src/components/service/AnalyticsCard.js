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

import './AnalyticsCard.css';

import { ANALYTICS_REPORTING_ID } from '../../config';
import Card from '../../common/components/service/Card.js';
import Col from 'react-bootstrap/Col';
import { ExternalLink } from '../../common/utils';
import PropTypes from 'prop-types';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { base64URLEncode } from '../../common/base64URL';
import { useAnalytics } from '../../hooks';

/**
 * Card used for displaying analytics details about a service.
 */
export default function AnalyticsCard(props) {
  let getAnalyticsUrl = function() {
    return (
      'https://analytics.google.com/analytics/web/#/report/content-pages/' +
      ANALYTICS_REPORTING_ID +
      '/_u.dateOption=last30days&_u.hasComparison=true&_r.drilldown=analytics.pagePath:~2Fservices~2F' +
      base64URLEncode('/api/services/' + props.serviceId) +
      '&explorer-table.plotKeys=%5B%5D&explorer-table.secSegmentId=analytics.pageTitle/'
    );
  };

  let renderTrendingCol = function(trendingPercent) {
    if (!trendingPercent) {
      trendingPercent = 0;
    }

    // Round to the nearest percent.
    trendingPercent = Math.round(trendingPercent);

    var icon = 'trending_flat';
    var className = 'analytics-trending';
    if (trendingPercent > 0) {
      icon = 'trending_up';
      className += ' analytics-trending-up';
    } else if (trendingPercent < 0) {
      icon = 'trending_down';
    }

    // Remove the negative sign.
    trendingPercent = Math.abs(trendingPercent);

    return (
      <div className={className}>
        {icon && <i className="material-icons">{icon}</i>}
        {trendingPercent}%
      </div>
    );
  };

  let renderMetricsRow = function(metrics, name, visibleName, className) {
    var metric = metrics && metrics.find(metric => metric.name === name);
    if (!metric) {
      metric = { name: name, value: 0, trend: 0 };
    }
    return (
      <Row>
        <Col>
          <span className={className}>{metric.value}</span>
          <span>{visibleName}</span>
        </Col>
        {renderTrendingCol(metric.trend)}
      </Row>
    );
  };

  let renderAnalytics = function(analytics) {
    var allZero = analytics.metrics.reduce(
      (allZero, metric) => allZero && metric.value === 0 && metric.trend === 0,
      true
    );

    if (allZero) {
      return 'No data available yet';
    }

    return (
      <div>
        {renderMetricsRow(
          analytics.metrics,
          'PageViews',
          'views in last 30 days',
          'analytics-pageviews'
        )}
        <Row></Row>
        {renderMetricsRow(
          analytics.metrics,
          'LearnMore',
          'clicked “Learn More”',
          'analytics-clicks'
        )}
        {renderMetricsRow(
          analytics.metrics,
          'Share',
          'clicked “Share”',
          'analytics-clicks'
        )}
      </div>
    );
  };

  const analytics = useAnalytics(props.serviceId);

  return (
    <Card
      header={
        <>
          Analytics
          {props.serviceId && (
            <ExternalLink
              className="analytics-more"
              url={getAnalyticsUrl()}
              action="Analytics"
            >
              <span className="btn btn-blue-text">
                More <i className="material-icons">open_in_new</i>
              </span>
            </ExternalLink>
          )}
        </>
      }
    >
      {(analytics && renderAnalytics(analytics)) ||
        (props.serviceId && <Spinner animation="border" />) ||
        'No data available yet'}
    </Card>
  );
}

AnalyticsCard.propTypes = {
  serviceId: PropTypes.string
};
