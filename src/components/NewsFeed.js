import {
  Box,
  Card,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Zoom,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
    boxShadow: theme.custom.shadows.grayAround,
    borderRadius: '5px',
    background: theme.custom.colors.whiteAlmost,
    padding: '16px',
    gap: '18px',
    marginBottom: '12px',
    cursor: 'pointer',

    '&:hover': {
      background: theme.custom.colors.blackSqueeze,
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
  divider: { backgroundColor: theme.custom.colors.oldLavender },
  content: {
    paddingTop: '16px',
    color: theme.custom.colors.violet,
    '& p:last-of-type': {
      display: 'inline',
    },
    '& a': {
      color: theme.custom.colors.purple,
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
    color: theme.custom.colors.violet,
    display: 'block',
    fontWeight: '500',
  },
  date: {
    color: theme.custom.colors.oldLavender,
    fontSize: '12px',
  },
  cardContentCloseIcon: {
    color: theme.custom.colors.oldLavender,

    '&:hover': {
      color: theme.custom.colors.mountbattenPink,
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

const NewsFeed = ({ news, isLoading, isMoreAvailable, onLoadMore }) => {
  return (
    <Box>
      <NewsList news={news} />
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

const NewsList = ({ news }) => {
  const newsListElement = news.map((item) => {
    return <NewsItem key={item.id} newsItem={item} />;
  });

  return <Box>{newsListElement}</Box>;
};

const NewsItem = ({ newsItem }) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);

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
  news: PropTypes.array.isRequired,
  onLoadMore: PropTypes.func,
};

NewsList.propTypes = {
  news: PropTypes.array.isRequired,
};

NewsItem.propTypes = {
  newsItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    url: PropTypes.string,
    date: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export default NewsFeed;
