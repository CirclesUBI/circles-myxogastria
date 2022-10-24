import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { IconMegaphone } from '../styles/icons';
import { ACTIVITIES_PATH } from '~/routes';

import ActivityStream from '~/components/ActivityStream';
import NewsFeed from '~/components/NewsFeed';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import { useQuery } from '~/hooks/url';
import core from '~/services/core';
import translate from '~/services/locale';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { IconConnections, IconTransactions } from '~/styles/icons';

const { ActivityFilterTypes } = core.activity;
const { newsItems } = core.news;

const DEFAULT_CATEGORY = ActivityFilterTypes.TRANSFERS;

const QUERY_FILTER_MAP = {
  transfers: ActivityFilterTypes.TRANSFERS,
  connections: ActivityFilterTypes.CONNECTIONS,
  news: 'News',
};

const filterToQuery = (filterName) => {
  return Object.keys(QUERY_FILTER_MAP).find((key) => {
    return QUERY_FILTER_MAP[key] === filterName;
  });
};

const useStyles = makeStyles(() => ({
  tabNavigationContainer: {
    marginBottom: '43px',
  },
}));

const ActivityStreamWithTabs = ({ basePath = ACTIVITIES_PATH }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const { category } = useQuery();
  const preselectedCategory =
    category in QUERY_FILTER_MAP
      ? QUERY_FILTER_MAP[category]
      : DEFAULT_CATEGORY;

  const [selectedCategory, setSelectedCategory] = useState(preselectedCategory);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);

  const activity = categories[selectedCategory];
  const isLoading = activity?.isLoadingMore || activity?.lastUpdated === 0;

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

  const handleLoadMoreNews = () => {};
  const isLoadingMoreNews = false;
  const isMoreAvailableNews = false;

  return (
    <>
      <TabNavigation
        className={classes.tabNavigationContainer}
        value={selectedCategory}
        onChange={handleFilterSelection}
      >
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
        <TabNavigationAction
          icon={<IconMegaphone />}
          itemsCounter={newsItems.length + 1}
          label={translate('ActivityStreamWithTabs.bodyFilterNews')}
          value={'News'}
        />
      </TabNavigation>
      {activity && (
        <ActivityStream
          activities={activity?.activities}
          isLoading={isLoading}
          isMoreAvailable={activity?.isMoreAvailable}
          lastSeenAt={lastSeenAt}
          lastUpdatedAt={activity?.lastUpdatedAt}
          onLoadMore={handleLoadMore}
        />
      )}
      {/* TODO merge(?) NewsFeed with ActivityStream depending on API */}
      {preselectedCategory === 'News' && (
        <NewsFeed
          isLoading={isLoadingMoreNews}
          isMoreAvailable={isMoreAvailableNews}
          news={newsItems}
          onLoadMore={handleLoadMoreNews}
        ></NewsFeed>
      )}
    </>
  );
};

ActivityStreamWithTabs.propTypes = {
  basePath: PropTypes.string,
};

export default ActivityStreamWithTabs;
