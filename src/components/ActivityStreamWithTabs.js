import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { ACTIVITIES_PATH } from '~/routes';

import ActivityStream from '~/components/ActivityStream';
import BadgeTab from '~/components/BadgeTab';
<<<<<<< HEAD
import Button from '~/components/Button';
=======
import ButtonIcon from '~/components/ButtonIcon';
import DialogExportStatement from '~/components/DialogExportStatement';
>>>>>>> a3ea72e (Basic UI for export statement)
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import { useIsOrganization, useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import { loadMoreActivities, updateLastSeen } from '~/store/activity/actions';
import { CATEGORIES } from '~/store/activity/reducers';
import { IconConnections, IconTransactions } from '~/styles/icons';
import { downloadCsvStatement } from '~/utils/fileExports';

const { ActivityFilterTypes } = core.activity;

const DEFAULT_CATEGORY = ActivityFilterTypes.CONNECTIONS;

const useStyles = makeStyles(() => ({
  exportContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '-15px 0 30px',
  },
}));

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
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = useState(true);

  const [categorySetByUser, setCategorySetByUser] = useState(false);
  const { categories, lastSeenAt } = useSelector((state) => state.activity);
  const safeAddress = useSelector((state) => state.safe.currentAccount);
  const { isOrganization } = useIsOrganization(safeAddress);
  const { username } = useUserdata(safeAddress);

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

  return (
    <Fragment>
      <TabNavigation value={selectedCategory} onChange={handleFilterSelection}>
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
      </TabNavigation>
      {// {selectedCategory === ActivityFilterTypes.TRANSFERS && isOrganization && (
      //   <Button onClick={() => downloadCsvStatement(username, safeAddress)}>
      //     Export Statement Download
      //   </Button>
      // )}
      // {/* TODO: styling */}
      }
      <Box className={classes.exportContainer}>
        <ButtonIcon icon="IconUnion" onClick={exportStatementBtnHandler}>
          {translate('ExportStatement.exportBtnText')}
        </ButtonIcon>
      </Box>
      <DialogExportStatement
        dialogOpen={dialogOpen}
        onCloseHandler={dialogCloseHandler}
      />
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
  address: PropTypes.string,
  basePath: PropTypes.string,
};

export default ActivityStreamWithTabs;
