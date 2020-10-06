import React, { Fragment, useState, useEffect } from 'react';
import qs from 'qs';
import { Container } from '@material-ui/core';
import { useHistory, generatePath } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ActivityStream from '~/components/ActivityStream';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import View from '~/components/View';
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

const Activities = () => {
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

    history.replace(`${generatePath(ACTIVITIES_PATH)}?${query}`);
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
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('Activities.headingActivityLog')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <TabNavigation
            value={selectedCategory}
            onChange={handleFilterSelection}
          >
            <TabNavigationAction
              icon={<IconTransactions />}
              label={translate('Activities.bodyFilterTransactions')}
              value={ActivityFilterTypes.TRANSFERS}
            />
            <TabNavigationAction
              icon={<IconConnections />}
              label={translate('Activities.bodyFilterConnections')}
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
        </Container>
      </View>
    </Fragment>
  );
};

export default Activities;
