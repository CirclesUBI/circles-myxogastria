import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  textContainer: {
    textAlign: 'center',
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
      <Typography align="center" gutterBottom variant="h2">
        {heading}
      </Typography>
      <Box className={classes.textContainer}>
        <Typography variant="body1">{body}</Typography>
      </Box>
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
