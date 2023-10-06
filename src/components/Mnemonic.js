import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  seedContainer: {
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: '0 0 0 10px',
  },
  seedItem: {
    background: theme.custom.colors.greyLightest,
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: theme.custom.shadows.gray,
    display: 'inline-block',
    marginBottom: 6,
    marginLeft: 22,
    padding: '0 0 0 6px',
    position: 'relative',
    textAlign: 'left',
    whiteSpace: 'pre',
    width: '20%',
    '&:nth-child(4n + 1)': {
      marginLeft: 0,
    },
    '&:before': {
      content: 'attr(data)',
      marginRight: 4,
      opacity: 0.4,
      position: 'absolute',
      left: '-23px',
      width: '20px',
      height: '20px',
      textAlign: 'right',
    },
  },
}));

const Mnemonic = ({ text }) => {
  const classes = useStyles();
  return (
    <ol className={classes.seedContainer}>
      {text.split(' ').map((word, index) => {
        return (
          <li className={classes.seedItem} data={index + 1} key={index}>
            <Typography variant="body4">{word + ' '}</Typography>
          </li>
        );
      })}
    </ol>
  );
};

Mnemonic.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Mnemonic;
