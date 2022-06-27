import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  textContainer: {
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '300',
  },
}));

const TutorialSlideImage = ({ image }) => {
  return (
    <Box
      alignItems="center"
      display="flex"
      height={200}
      justifyContent="center"
    >
      {image}
    </Box>
  );
};

const TutorialSlide = ({ image, heading, body }) => {
  const classes = useStyles();

  return (
    <Box padding={4} paddingTop={9}>
      <TutorialSlideImage image={image} />
      <Typography align="center" gutterBottom variant="h6">
        {heading}
      </Typography>
      <Box className={classes.textContainer}>{body}</Box>
    </Box>
  );
};

TutorialSlideImage.propTypes = {
  image: PropTypes.node.isRequired,
};

TutorialSlide.propTypes = {
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  heading: PropTypes.string.isRequired,
  image: PropTypes.node.isRequired,
};

export default TutorialSlide;
