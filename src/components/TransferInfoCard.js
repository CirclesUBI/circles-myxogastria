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
import { fontSizeSmaller } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    boxShadow: theme.custom.shadows.grey,
  },
  cardHeader: {
    padding: theme.spacing(1),
    textAlign: 'left',
  },
  cardHeaderContent: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: fontSizeSmaller,
    '& > *': {
      marginRight: theme.spacing(0.5),
    },
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
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
        <Typography variant="h4">{label}</Typography>
      </InputLabel>
      <Card className={classes.cardContainer}>
        <CardHeader
          avatar={<Avatar address={address} size="tiny" />}
          className={classes.cardHeader}
          subheader={
            <Tooltip arrow title={tooltip}>
              <Typography className={classes.cardHeaderContent} component="div">
                <CirclesLogoSVG
                  height={fontSizeSmaller}
                  width={fontSizeSmaller}
                />
                <Typography
                  classes={{ root: 'body6_monochrome' }}
                  variant="body6"
                >
                  {text}
                </Typography>
                {isLoading && <CircularProgress size={fontSizeSmaller} />}
              </Typography>
            </Tooltip>
          }
          title={<Typography variant="h5">{`@${username}`}</Typography>}
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
