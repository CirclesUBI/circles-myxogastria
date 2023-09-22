import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { ACTIVITIES_PATH } from '~/routes';

import ActivityStream from '~/components/ActivityStream';
import BadgeTab from '~/components/BadgeTab';
import ButtonIcon from '~/components/ButtonIcon';
import DialogExportStatement from '~/components/DialogExportStatement';
import Popover from '~/components/Popover';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import core from '~/services/core';
import translate from '~/services/locale';
import {
  loadMoreActivities,
  loadMoreActivitiesNews,
  updateLastSeen,
} from '~/store/activity/actions';
import { CATEGORIES } from '~/store/activity/reducers';
import {
  IconConnections,
  IconMegaphone,
  IconTransactions,
} from '~/styles/icons';
import {
  FILTER_TRANSACTION_ALL,
  FILTER_TRANSACTION_RECEIVED,
  FILTER_TRANSACTION_SENT,
} from '~/utils/constants';

const { ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.CONNECTIONS;

const useStyles = makeStyles(() => ({
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: '-15px 0 0',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  isHidden: {
    visibility: 'hidden',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    '& span svg.MuiSvgIcon-root': {
      fontSize: '13px',
    },
  },
  popoverContent: {
    minWidth: '189px',
  },
  filterItem: {
    cursor: 'pointer',
    margin: '0 0 12px',
    display: 'block',
    '&:last-child': {
      marginBottom: '0',
    },
  },
  filterItemActive: {
    fontWeight: 700,
  },
}));

const QUERY_FILTER_MAP = {
  transfers: ActivityFilterTypes.TRANSFERS,
  connections: ActivityFilterTypes.CONNECTIONS,
  news: Symbol('NEWS'),
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

  const [categorySetByUser, setCategorySetByUser] = useState(false);
  const [filterTransactionsIndex, setFilterTransactionIndex] = useState(0);
  const [filterTransactionsType, setFilterTransactionType] = useState(
    FILTER_TRANSACTION_ALL,
  );
  const filterItems = [
    {
      title: translate('Activities.filterAllTitle'),
      type: FILTER_TRANSACTION_ALL,
    },
    {
      title: translate('Activities.filterSentTitle'),
      type: FILTER_TRANSACTION_SENT,
    },
    {
      title: translate('Activities.filterReceivedTitle'),
      type: FILTER_TRANSACTION_RECEIVED,
    },
  ];
  const [filterTitle, setFilterTitle] = useState(filterItems[0].title);
  const [anchorEl, setAnchorEl] = useState(null);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);
  const news = useSelector((state) => state.activity.news);

  // Get only new Activities and segregate them by category
  let newActivities = CATEGORIES.reduceRight((newActivities, category) => {
    const newActivitiesInCategoryCounter = categories[
      category
    ].activities.reduce((itemAcc, activity) => {
      return activity.createdAt > lastSeenAt ? itemAcc + 1 : itemAcc;
    }, 0);

    newActivities[category] = newActivitiesInCategoryCounter;

    return newActivities;
  }, {});

  const newNews = news.activities.reduce((itemAcc, activity) => {
    return activity.createdAt > lastSeenAt ? itemAcc + 1 : itemAcc;
  }, 0);
  newActivities = { ...newActivities, [QUERY_FILTER_MAP.news]: newNews };

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

  const activity =
    selectedCategory !== QUERY_FILTER_MAP.news
      ? categories[selectedCategory]
      : news;
  const isLoadingInitial =
    activity?.isLoadingInitial || activity?.lastUpdated === 0;
  const isLoadingMore = activity?.isLoadingMore || activity?.lastUpdated === 0;

  const handleLoadMore = () => {
    if (selectedCategory === QUERY_FILTER_MAP.news) {
      dispatch(loadMoreActivitiesNews());
    } else {
      dispatch(loadMoreActivities(selectedCategory));
    }
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

  const filterBtnHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const filterItemClickHandler = (index, type, title) => {
    setFilterTransactionIndex(index);
    setFilterTransactionType(type);
    setFilterTitle(title);
    setAnchorEl(null);
  };

  const filterPopoverOpenHandler = Boolean(anchorEl);
  const filterPopoverCloseHandler = () => {
    setAnchorEl(null);
  };

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
          icon={
            <BadgeTab
              badgeContent={newActivities[QUERY_FILTER_MAP.news]}
              icon={IconMegaphone}
              isActive
            />
          }
          label={translate('ActivityStreamWithTabs.bodyFilterNews')}
          value={QUERY_FILTER_MAP.news}
        />
      </TabNavigation>
      <Box className={classes.actionsContainer}>
        <Box
          className={clsx(classes.filterContainer, {
            [classes.isHidden]:
              selectedCategory !== ActivityFilterTypes.TRANSFERS,
          })}
        >
          <ButtonIcon
            ariaDescribedby={'filterTransactionPopover'}
            icon="IconArrowDown"
            onClick={filterBtnHandler}
          >
            {filterTitle}
          </ButtonIcon>
          <Popover
            anchorEl={anchorEl}
            className={classes.popoverContent}
            id={'filterTransactionPopover'}
            open={filterPopoverOpenHandler}
            onClose={filterPopoverCloseHandler}
          >
            {filterItems.map((item, index) => {
              const className =
                filterTransactionsIndex === index
                  ? clsx(classes.filterItemActive, classes.filterItem)
                  : classes.filterItem;
              return (
                <Typography
                  className={className}
                  key={index}
                  variant="body7"
                  onClick={() =>
                    filterItemClickHandler(index, item.type, item.title)
                  }
                >
                  {item.title}
                </Typography>
              );
            })}
          </Popover>
        </Box>
        {selectedCategory === ActivityFilterTypes.TRANSFERS && (
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
      </Box>
      {activity && (
        <ActivityStream
          activities={activity.activities}
          filterType={filterTransactionsType}
          isLoadingInitial={isLoadingInitial}
          isLoadingMore={isLoadingMore}
          isMoreAvailable={activity.isMoreAvailable}
          lastSeenAt={lastSeenAt}
          lastUpdatedAt={activity.lastUpdatedAt}
          onLoadMore={handleLoadMore}
        />
      )}
    </>
  );
};

ActivityStreamWithTabs.propTypes = {
  address: PropTypes.string,
  basePath: PropTypes.string,
};

export default ActivityStreamWithTabs;
