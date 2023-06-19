import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { IconMegaphone } from '../styles/icons';
import { ACTIVITIES_PATH } from '~/routes';

import ActivityStream from '~/components/ActivityStream';
import BadgeTab from '~/components/BadgeTab';
import ButtonIcon from '~/components/ButtonIcon';
import DialogExportStatement from '~/components/DialogExportStatement';
import NewsFeed from '~/components/NewsFeed';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import { useQuery } from '~/hooks/url';
import { useIsOrganization } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { CATEGORIES } from '~/store/activity/reducers';
import { IconConnections, IconTransactions } from '~/styles/icons';

const { ActivityFilterTypes } = core.activity;
const { activities: newsActivities } = core.news;

const DEFAULT_CATEGORY = ActivityFilterTypes.CONNECTIONS;

const useStyles = makeStyles(() => ({
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '-15px 0 30px',
  },
  tabNavigationContainer: {
    marginBottom: '43px',
  },
}));

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

const ActivityStreamWithTabs = ({ basePath = ACTIVITIES_PATH }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { category } = useQuery();
  const preselectedCategory =
    category in QUERY_FILTER_MAP
      ? QUERY_FILTER_MAP[category]
      : DEFAULT_CATEGORY;

  const [categorySetByUser, setCategorySetByUser] = useState(false);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);
  const safeAddress = useSelector((state) => state.safe.currentAccount);
  const { isOrganization } = useIsOrganization(safeAddress);

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
  const isLoading = activity?.isLoadingMore || activity?.lastUpdated === 0;

  const handleLoadMore = () => {
    dispatch(loadMoreActivities(selectedCategory));
  };

  const exportStatementBtnHandler = () => {
    setDialogOpen(true);
  };

  const dialogCloseHandler = () => {
    setDialogOpen(false);
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
  const handleLoadMoreNews = () => {};
  const isLoadingMoreNews = false;
  const isMoreAvailableNews = false;

  const newNewsActivities = newsActivities.reduceRight((acc, activity) => {
    return activity.createdAt > lastSeenAt ? acc + 1 : acc;
  }, 0);

  return (
    <>
      <TabNavigation
        className={classes.tabNavigationContainer}
        value={selectedCategory}
        onChange={handleFilterSelection}
      >
        <TabNavigationAction
          icon={
            <BadgeTab
              badgeContent={newActivities[QUERY_FILTER_MAP.transfers]}
              icon={IconTransactions}
              isActive
            />
          }
          label={translate('ActivityStreamWithTabs.bodyFilterTransactions')}
          value={ActivityFilterTypes.TRANSFERS}
        />
        <TabNavigationAction
          icon={
            <BadgeTab
              badgeContent={newActivities[QUERY_FILTER_MAP.connections]}
              icon={IconConnections}
              isActive
            />
          }
          label={translate('ActivityStreamWithTabs.bodyFilterConnections')}
          value={ActivityFilterTypes.CONNECTIONS}
        />
        <TabNavigationAction
          icon={<IconMegaphone />}
          itemsCounter={
            preselectedCategory !== 'News' && newNewsActivities
              ? newNewsActivities
              : null
          }
          label={translate('ActivityStreamWithTabs.bodyFilterNews')}
          value={'News'}
        />
      </TabNavigation>
      {selectedCategory === ActivityFilterTypes.TRANSFERS && isOrganization && (
        <>
          <Box className={classes.exportContainer}>
            <ButtonIcon icon="IconUnion" onClick={exportStatementBtnHandler}>
              {translate('ExportStatement.exportBtnText')}
            </ButtonIcon>
          </Box>
          <DialogExportStatement
            dialogOpen={dialogOpen}
            onCloseHandler={dialogCloseHandler}
          />
        </>
      )}
      {activity && (
        <ActivityStream
          activities={activity.activities}
          isLoading={isLoading}
          isMoreAvailable={activity.isMoreAvailable}
          lastSeenAt={lastSeenAt}
          lastUpdatedAt={activity.lastUpdatedAt}
          onLoadMore={handleLoadMore}
        />
      )}
      {/* TODO merge(?) NewsFeed with ActivityStream depending on API */}
      {preselectedCategory === 'News' && (
        <NewsFeed
          isLoading={isLoadingMoreNews}
          isMoreAvailable={isMoreAvailableNews}
          lastSeenAt={lastSeenAt}
          news={newsActivities}
          onLoadMore={handleLoadMoreNews}
        ></NewsFeed>
      )}
    </>
  );
};

ActivityStreamWithTabs.propTypes = {
  address: PropTypes.string,
  basePath: PropTypes.string,
};

export default ActivityStreamWithTabs;
