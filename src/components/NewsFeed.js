import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Zoom,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '~/components/Button';
import translate from '~/services/locale';
import {
  IconCirclesLogoLight,
  IconExclamationAndQuestionMark,
  IconHeartWithExclamationMark,
} from '~/styles/icons';
import { IconCloseOutline } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  newsItemContainer: {
    boxShadow: theme.custom.shadows.greyAround,
    borderRadius: '5px',
    background: theme.custom.colors.white,
    padding: '16px',
    gap: '18px',
    marginBottom: '12px',
    cursor: 'pointer',

    '&:hover': {
      background: theme.custom.colors.blue600,
    },
  },
  newsItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsItemContentContainer: {
    paddingTop: '16px',
  },
  divider: { backgroundColor: theme.custom.colors.purple200 },
  content: {
    paddingTop: '16px',
    color: theme.custom.colors.purple100,
    '& p:last-of-type': {
      display: 'inline',
    },
    '& a': {
      color: theme.custom.colors.pink100,
      textDecoration: 'none',
    },
  },
  iconContainer: {
    width: '33px',
    height: '33px',
    display: 'flex',
    marginRight: '18px',
    alignItems: 'center',
    justifyContent: 'center',

    '& .MuiSvgIcon-root': {
      width: '100%',
      height: '100%',
    },
  },
  title: {
    color: theme.custom.colors.purple100,
    display: 'block',
    fontWeight: '500',
  },
  date: {
    color: theme.custom.colors.purple200,
    fontSize: '12px',
  },
  cardContentCloseIcon: {
    color: theme.custom.colors.purple200,

    '&:hover': {
      color: theme.custom.colors.purple300,
      backgroundColor: 'transparent',
    },
  },
}));

const iconSelector = (icon) => {
  switch (icon) {
    case 'IconHeartWithExclamationMark':
      return IconExclamationAndQuestionMark;
    case 'IconCirclesLogoLight':
      return IconCirclesLogoLight;
    case 'IconExclamationAndQuestionMark':
      return IconHeartWithExclamationMark;
    default:
      return IconExclamationAndQuestionMark;
  }
};

const NewsFeed = ({
  news,
  isLoading,
  isMoreAvailable,
  onLoadMore,
  lastSeenAt,
}) => {
  return (
    <Box>
      <NewsList lastSeenAt={lastSeenAt} news={news} />
      {isLoading && (
        <Box mx="auto" my={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}
      {isMoreAvailable && onLoadMore && (
        <Box my={2}>
          <Button disabled={isLoading} fullWidth isOutline onClick={onLoadMore}>
            {translate('ActivityStream.buttonLoadMore')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

const NewsList = ({ news, lastSeenAt }) => {
  const newsListElement = news.map((item) => {
    return <NewsItem key={item.id} lastSeenAt={lastSeenAt} newsItem={item} />;
  });

  return <Box>{newsListElement}</Box>;
};

const NewsItem = ({ newsItem, lastSeenAt }) => {
  const classes = useStyles();

  const [isExpanded, setIsExpanded] = useState(newsItem.createdAt > lastSeenAt);

  const handleBtnContent = () => {
    setIsExpanded(!isExpanded);
  };
  const Icon = iconSelector(newsItem.icon);

  return (
    <Card className={classes.newsItemContainer} onClick={handleBtnContent}>
      <Box className={classes.newsItemHeader}>
        <Box className={classes.iconContainer}>
          <Icon />
        </Box>
        <Box>
          <span className={classes.title}>{newsItem.title}</span>
          <span className={classes.date}>{newsItem.date}</span>
        </Box>
      </Box>
      <Collapse in={isExpanded}>
        <Box className={classes.newsItemContentContainer}>
          <Divider classes={{ root: classes.divider }} />
          <Box
            className={classes.content}
            dangerouslySetInnerHTML={{
              __html: `${newsItem.text} <a href=${
                newsItem.url
              } rel="noopener noreferrer" target="_blank">${translate(
                'ActivityStream.linkLearnMore',
              )}</a>`,
            }}
          />
          <Zoom
            in={isExpanded}
            style={{ transitionDelay: isExpanded ? '250ms' : '0ms' }}
          >
            <Box display="flex" justifyContent="center">
              <IconButton
                classes={{ root: classes.cardContentCloseIcon }}
                onClick={handleBtnContent}
              >
                <IconCloseOutline />
              </IconButton>
            </Box>
          </Zoom>
        </Box>
      </Collapse>
    </Card>
  );
};

NewsFeed.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isMoreAvailable: PropTypes.bool.isRequired,
  lastSeenAt: PropTypes.string,
  news: PropTypes.array.isRequired,
  onLoadMore: PropTypes.func,
};

NewsList.propTypes = {
  lastSeenAt: PropTypes.string,
  news: PropTypes.array.isRequired,
};

NewsItem.propTypes = {
  lastSeenAt: PropTypes.string,
  newsItem: PropTypes.shape({
    createdAt: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    url: PropTypes.string,
    date: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export default NewsFeed;
