import {
  Box,
  CircularProgress,
  Container,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import ProfileMini from '~/components/ProfileMini';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import { useRelativeProfileLink } from '~/hooks/url';
import translate from '~/services/locale';
import {
  checkOtherTokens,
  checkOtherTokensLoading,
} from '~/store/token/actions';
import { checkTrustState } from '~/store/trust/actions';
import { formatCirclesValue } from '~/utils/format';

const useStyles = makeStyles(() => ({
  tokenContainer: {
    paddingTop: '32px',
  },
  tokenListContainer: {
    paddingTop: '32px',
    paddingBottom: '16px',
  },
  tokenItem: {
    marginBottom: '16px',
    cursor: 'pointer',
  },
  link: {
    '&:hover': {
      textDecoration: 'none',
    },
  },
  balanceContainer: {
    margin: '0 auto',
    textAlign: 'center',
  },
}));

const Tokens = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const otherTokens = useSelector((state) => state.token.otherTokens);

  useUpdateLoop(
    async () => {
      if (otherTokens.length === 0) {
        await dispatch(checkOtherTokensLoading(false));
      } else {
        await dispatch(checkOtherTokensLoading(true));
      }
      await dispatch(checkOtherTokens());
      await dispatch(checkTrustState());
    },
    {
      frequency: 1000 * 10,
    },
  );

  return (
    <>
      <Header>
        <ButtonBack />
        <CenteredHeading>{translate('Tokens.headingTokens')}</CenteredHeading>
      </Header>
      <View>
        <Container className={classes.tokenContainer} maxWidth="sm">
          <Box className={classes.balanceContainer}>
            <BalanceDisplay underlineAtHover={false} />
          </Box>
          <Typography>{translate('Tokens.descriptionTokens')}</Typography>
          <TokensList
            isLoading={otherTokens.isLoading}
            otherTokens={otherTokens.otherTokens}
          />
        </Container>
      </View>
    </>
  );
};

const TokensList = ({ otherTokens, isLoading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.tokenListContainer}>
      {(!isLoading || otherTokens?.length !== 0) &&
        otherTokens?.map((item, index) => {
          const circlesValue = formatCirclesValue(
            item.amount,
            Date.now(),
            2,
            false,
          );
          return (
            <TokenItem
              key={index}
              ownerAddress={item.ownerAddress}
              value={circlesValue}
            />
          );
        })}
      {isLoading && otherTokens?.length === 0 && (
        <Box mx="auto" my={2} textAlign="center">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

const TokenItem = ({ ownerAddress, value }) => {
  const classes = useStyles();
  const profilePath = useRelativeProfileLink(ownerAddress);

  return (
    <MuiLink
      className={classes.link}
      component={Link}
      to={profilePath}
      underline="hover"
    >
      <ProfileMini
        address={ownerAddress}
        className={classes.tokenItem}
        value={value}
      />
    </MuiLink>
  );
};

TokensList.propTypes = {
  isLoading: PropTypes.bool,
  otherTokens: PropTypes.array,
};

TokenItem.propTypes = {
  ownerAddress: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Tokens;
