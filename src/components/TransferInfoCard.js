import {
  Card,
  CardHeader,
  CircularProgress,
  InputLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import CirclesLogoSVG from '%/images/logo.svg';
import Avatar from '~/components/Avatar';
import { useUserdata } from '~/hooks/username';

const fontSize = 12;

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    boxShadow: theme.custom.shadows.gray,
  },
  cardHeader: {
    padding: theme.spacing(1),
    textAlign: 'left',
  },
  cardHeaderContent: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize,
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
    '&>span': {
      color: theme.custom.colors.grayDarkest,
    },
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: '18px',
    textAlign: 'left',
  },
}));

const TransferInfoCard = ({
  address,
  isLoading = false,
  label,
  text,
  tooltip,
}) => {
  const classes = useStyles();
  const { username } = useUserdata(address);

  return (
    <Fragment>
      <InputLabel className={classes.inputLabel} htmlFor="receiver">
        {label}
      </InputLabel>
      <Card className={classes.cardContainer}>
        <CardHeader
          avatar={<Avatar address={address} size="tiny" />}
          className={classes.cardHeader}
          subheader={
            <Tooltip arrow title={tooltip}>
              <Typography className={classes.cardHeaderContent} component="div">
                <CirclesLogoSVG height={fontSize} width={fontSize} />
                <span>{text}</span>
                {isLoading && <CircularProgress size={fontSize} />}
              </Typography>
            </Tooltip>
          }
          title={`@${username}`}
        />
      </Card>
    </Fragment>
  );
};

TransferInfoCard.propTypes = {
  address: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};

export default TransferInfoCard;
