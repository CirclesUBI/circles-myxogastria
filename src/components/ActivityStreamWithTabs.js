import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import qs from 'qs';
import { useHistory, generatePath } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import core from '~/services/core';
import translate from '~/services/locale';
import { ACTIVITIES_PATH } from '~/routes';
import { IconConnections, IconTransactions } from '~/styles/icons';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { useQuery } from '~/hooks/url';

const { ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.TRANSFERS;

const QUERY_FILTER_MAP = {
  transfers: ActivityFilterTypes.TRANSFERS,
  connections: ActivityFilterTypes.CONNECTIONS,
};

const filterToQuery = (filterName) => {
  return Object.keys(QUERY_FILTER_MAP).find((key) => {
    return QUERY_FILTER_MAP[key] === filterName;
  });
};

const ActivityStreamWithTabs = ({ basePath = ACTIVITIES_PATH }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { category } = useQuery();
  const preselectedCategory =
    category in QUERY_FILTER_MAP
      ? QUERY_FILTER_MAP[category]
      : DEFAULT_CATEGORY;

  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);

  const activity = categories[selectedCategory];
  const isLoading = activity.isLoadingMore || activity.lastUpdated === 0;

  const handleLoadMore = () => {
    dispatch(loadMoreActivities(selectedCategory));
  };

  const handleFilterSelection = (event, newFilter) => {
    const query = qs.stringify({
      category: filterToQuery(newFilter) || filterToQuery(DEFAULT_CATEGORY),
    });

    history.replace(`${generatePath(basePath)}?${query}`);
    setSelectedCategory(newFilter);
  };

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, [dispatch]);

  return (
    <Fragment>
      <TabNavigation value={selectedCategory} onChange={handleFilterSelection}>
        <TabNavigationAction
          icon={<IconTransactions />}
          label={translate('ActivityStreamWithTabs.bodyFilterTransactions')}
          value={ActivityFilterTypes.TRANSFERS}
        />
        <TabNavigationAction
          icon={<IconConnections />}
          label={translate('ActivityStreamWithTabs.bodyFilterConnections')}
          value={ActivityFilterTypes.CONNECTIONS}
        />
      </TabNavigation>
      <ActivityStream
        activities={activity.activities}
        isLoading={isLoading}
        isMoreAvailable={activity.isMoreAvailable}
        lastSeenAt={lastSeenAt}
        lastUpdatedAt={activity.lastUpdatedAt}
        onLoadMore={handleLoadMore}
      />
    </Fragment>
  );
};

ActivityStreamWithTabs.propTypes = {
  basePath: PropTypes.string,
};

export default ActivityStreamWithTabs;
