import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

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
  return (
    <Box padding={4}>
      <TutorialSlideImage image={image} />
      <Typography align="center" gutterBottom variant="h2">
        {heading}
      </Typography>
      <Typography align="center">{body}</Typography>
    </Box>
  );
};

TutorialSlideImage.propTypes = {
  image: PropTypes.node.isRequired,
};

TutorialSlide.propTypes = {
  body: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  image: PropTypes.node.isRequired,
};

export default TutorialSlide;
