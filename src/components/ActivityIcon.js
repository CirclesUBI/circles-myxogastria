import { Badge, CircularProgress, IconButton } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import core from '~/services/core';
import { CATEGORIES } from '~/store/activity/reducers';
import { IconNotification } from '~/styles/icons';
const newsItems = core.news;

const DashboardActivityIcon = () => {
  const { categories, lastSeenAt } = useSelector((state) => {
    return state.activity;
  });

  const NEWS = Symbol.for('NEWS');
  const categoriesWithNews = { ...categories, ...{ [NEWS]: newsItems } };
  let CATEGORIES_WITH_NEWS = [...CATEGORIES];
  CATEGORIES_WITH_NEWS.push(NEWS);

  // Is there any pending transactions?
  const isPending = CATEGORIES_WITH_NEWS.find((category) => {
    return !!categoriesWithNews[category].activities.find((activity) => {
      return activity.isPending;
    });
  });

  // Count how many activities we haven't seen yet
  const count = CATEGORIES_WITH_NEWS.reduce((acc, category) => {
    return (
      acc +
      categoriesWithNews[category].activities.reduce((itemAcc, activity) => {
        return activity.createdAt > lastSeenAt ? itemAcc + 1 : itemAcc;
      }, 0)
    );
  }, 0);

  return (
    <IconButton
      aria-label="Activities"
      component={Link}
      edge="end"
      size="large"
      to="/activities"
    >
      {isPending ? (
        <CircularProgress size={28} />
      ) : (
        <Badge
          badgeContent={count}
          color="primary"
          max={99}
          overlap="rectangular"
        >
          <IconNotification style={{ fontSize: 28 }} />
        </Badge>
      )}
    </IconButton>
  );
};

export default DashboardActivityIcon;
