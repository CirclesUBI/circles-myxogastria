import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { ACTIVITIES_PATH } from '~/routes';

import ActivityStream from '~/components/ActivityStream';
import BadgeCircle from '~/components/BadgeCircle';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import core from '~/services/core';
import translate from '~/services/locale';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { CATEGORIES } from '~/store/activity/reducers';
import { IconConnections, IconTransactions } from '~/styles/icons';

const { ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.CONNECTIONS;

const QUERY_FILTER_MAP = {
  transfers: ActivityFilterTypes.TRANSFERS,
  connections: ActivityFilterTypes.CONNECTIONS,
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

  const [categorySetByUser, setCategorySetByUser] = useState(false);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);

  // Get only new Activities and segregate them by category
  const newActivities = CATEGORIES.reduceRight((newActivities, category) => {
    const newActivitiesInCategoryCounter = categories[
      category
    ].activities.reduce((itemAcc, activity) => {
      return activity.createdAt > lastSeenAt ? itemAcc + 1 : itemAcc;
    }, 0);

    newActivities[category] = newActivitiesInCategoryCounter;

    return newActivities;
  }, {});

  // Get the highest activity tab from all new activities
  const symbols = Object.getOwnPropertySymbols(newActivities);
  const newActivitiesHighestItem = symbols.reduce(
    (acc, symbol) => {
      if (newActivities[symbol] > acc[Object.getOwnPropertySymbols(acc)[0]]) {
        return { [symbol]: newActivities[symbol] };
      }
      return acc;
    },
    { [symbols[0]]: newActivities[symbols[0]] },
  );

  const [selectedCategory, setSelectedCategory] = useState(
    Object.getOwnPropertySymbols(newActivitiesHighestItem)[0],
  );

  const activity = categories[selectedCategory];
  const isLoading = activity.isLoadingMore || activity.lastUpdated === 0;

  const handleLoadMore = () => {
    dispatch(loadMoreActivities(selectedCategory));
  };

  const handleFilterSelection = useCallback(
    (event, newFilter) => {
      setCategorySetByUser(true);
      const query = qs.stringify({
        category: filterToQuery(newFilter) || filterToQuery(DEFAULT_CATEGORY),
      });

      history.replace(`${generatePath(basePath)}?${query}`);
      setSelectedCategory(newFilter);
    },
    [history, setSelectedCategory, basePath],
  );

  useEffect(() => {
    // Update last seen timestamp when we leave
    return () => {
      dispatch(updateLastSeen());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!categorySetByUser) {
      setSelectedCategory(
        Object.getOwnPropertySymbols(newActivitiesHighestItem)[0],
      );
    }
  }, [newActivitiesHighestItem, setSelectedCategory, categorySetByUser]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryString = params.get('category');
    const category = QUERY_FILTER_MAP[categoryString];

    if (category) {
      handleFilterSelection(null, category);
    }
  }, [handleFilterSelection]);

  return (
    <Fragment>
      <TabNavigation
        className={classes.tabNavigationContainer}
        value={selectedCategory}
        onChange={handleFilterSelection}
      >
        <TabNavigationAction
          icon={
            <BadgeCircle
              badgeContent={
                selectedCategory != QUERY_FILTER_MAP.transfers
                ? newActivities[QUERY_FILTER_MAP.transfers]
                : null
              }
              icon={IconTransactions}
              isActive
            />
          }
          label={translate('ActivityStreamWithTabs.bodyFilterTransactions')}
          value={ActivityFilterTypes.TRANSFERS}
        />
        <TabNavigationAction
          icon={
            <BadgeCircle
              badgeContent={
              selectedCategory != QUERY_FILTER_MAP.connections
                ? newActivities[QUERY_FILTER_MAP.connections]
                : null
              }
              icon={IconConnections}
              isActive
            />
          }
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
