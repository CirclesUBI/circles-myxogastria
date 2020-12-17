import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  seedContainer: {
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: '0 16px',
  },
  seedItem: {
    background: '#fff',
    borderRadius: 4,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    marginBottom: 16,
    marginLeft: 9,
    padding: 8,
    position: 'relative',
    textAlign: 'left',
    whiteSpace: 'pre',
    width: 'calc(33.3% - 9px)',
    '&:nth-child(3n + 1)': {
      marginLeft: 0,
    },
    '&:before': {
      content: 'attr(data)',
      marginRight: 4,
      opacity: 0.4,
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
            {word + ' '}
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
