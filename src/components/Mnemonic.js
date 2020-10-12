import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  mnemonicItem: {
    margin: '0 auto',
    padding: theme.spacing(0.5),
    textAlign: 'center',
  },
}));

const Mnemonic = ({ text }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      {text.split(' ').map((word, index) => {
        return (
          <Grid item key={index} xs>
            <Paper className={classes.mnemonicItem}>{word}</Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

Mnemonic.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Mnemonic;
