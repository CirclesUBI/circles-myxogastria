import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import { updateUserMigration } from '~/store/user/actions';

const useStyles = makeStyles(() => ({
  migrationContainer: {
    marginTop: '10px',
    marginBottom: '40px',
    '& p': {
      marginBottom: '10px',
    },
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const MigrateYourProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isMigrateData, setIsMigrateData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const isMigrationAccepted = user?.isMigrationAccepted;

  useEffect(() => {
    if (isMigrationAccepted !== undefined) {
      setIsMigrateData(isMigrationAccepted);
      setIsLoading(false);
    }
  }, [isMigrationAccepted]);

  const handleOnChangeRadio = (event) => {
    setIsMigrateData(event.target.value === 'true');
  };

  const handleOnSubmit = () => {
    setIsMigrateData(isMigrateData);
    dispatch(updateUserMigration(isMigrateData));
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('MigrateYourProfile.title')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box className={classes.migrationContainer}>
            <Typography align="center" variant="body1">
              {translate('MigrateYourProfile.body1')}
            </Typography>
            <Typography align="center" variant="body1">
              {translate('MigrateYourProfile.body2')}
            </Typography>
            <Typography align="center" variant="body1">
              {translate('MigrateYourProfile.body3')}
            </Typography>
          </Box>
          <Box>
            <FormControl className={classes.formContainer} sx={{}}>
              <FormLabel id="migration-radio-buttons-group">
                <Typography align="center" variant="body1">
                  {translate('MigrateYourProfile.labelForm')}
                </Typography>
              </FormLabel>
              <Box>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <RadioGroup
                    aria-labelledby="migration-radio-buttons-group"
                    name="migration-radio-buttons-group"
                    row
                    value={isMigrateData}
                    onChange={handleOnChangeRadio}
                  >
                    <FormControlLabel
                      control={<Radio />}
                      label={translate('MigrateYourProfile.option1')}
                      value={true}
                    />
                    <FormControlLabel
                      control={<Radio />}
                      label={translate('MigrateYourProfile.option2')}
                      value={false}
                    />
                  </RadioGroup>
                )}
              </Box>
            </FormControl>
          </Box>
        </Container>
      </View>
      <Footer>
        <Button fullWidth onClick={handleOnSubmit}>
          {translate('MigrateYourProfile.buttonSubmit')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default MigrateYourProfile;
