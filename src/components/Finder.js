import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useParams, useHistory, generatePath } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileMini from '~/components/ProfileMini';
import QRCodeScanner from '~/components/QRCodeScanner';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import translate from '~/services/locale';
import { IconScan } from '~/styles/icons';
import { SEARCH_PATH } from '~/routes';

const MAX_SEARCH_RESULTS = 10;

const useStyles = makeStyles((theme) => ({
  searchInput: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: 10,
    backgroundColor: theme.palette.grey['100'],
    color: theme.palette.grey['800'],
  },
  searchItem: {
    cursor: 'pointer',
  },
}));

const Finder = ({ onSelect, basePath = SEARCH_PATH }) => {
  const classes = useStyles();
  const ref = useRef();

  const { input = '' } = useParams();
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const safe = useSelector((state) => state.safe);

  const onInputChange = (event) => {
    const { value } = event.target;
    history.replace(generatePath(basePath, value ? { input: value } : {}));
  };

  const handleSelect = (user) => {
    onSelect(user.safeAddress);
  };

  const handleScan = (address) => {
    setIsScannerOpen(false);
    onSelect(address);
  };

  const handleScannerError = () => {
    setIsScannerOpen(false);
  };

  const handleScannerOpen = () => {
    ref.current.blur();
    setIsScannerOpen(true);
  };

  const handleScannerClose = () => {
    setIsScannerOpen(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      // Search the database for similar usernames
      const response = await core.user.search(query);

      const result = response.data
        .filter((item) => {
          return item.safeAddress !== safe.currentAccount;
        })
        .sort((itemA, itemB) => {
          return itemA.username
            .toLowerCase()
            .localeCompare(itemB.username.toLowerCase());
        })
        .slice(0, MAX_SEARCH_RESULTS);

      setSearchResults(result);
      setIsLoading(false);
    }),
    [],
  );

  useEffect(() => {
    const cleanInput = input.trim().replaceAll('@', '');
    setIsQueryEmpty(cleanInput.length === 0);

    if (cleanInput.length === 0) {
      setSearchResults([]);
      return;
    }

    // Shortcut for putting in a valid address directly
    const matched = core.utils.matchAddress(cleanInput);
    if (matched) {
      onSelect(matched);
      return;
    }

    setIsLoading(true);
    debouncedSearch(cleanInput);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <Box display="flex" mb={2}>
        <Input
          autoComplete="off"
          autoFocus
          className={classes.searchInput}
          disableUnderline={true}
          fullWidth
          id="search"
          placeholder={translate('Finder.formSearch')}
          ref={ref}
          value={input}
          onChange={onInputChange}
        />
        <QRCodeScanner
          isOpen={isScannerOpen}
          onClose={handleScannerClose}
          onError={handleScannerError}
          onSuccess={handleScan}
        >
          <IconButton onClick={handleScannerOpen}>
            <IconScan />
          </IconButton>
        </QRCodeScanner>
      </Box>
      <FinderResults
        isLoading={isLoading}
        isQueryEmpty={isQueryEmpty}
        items={searchResults}
        onClick={handleSelect}
      />
    </Fragment>
  );
};

const FinderResults = (props) => {
  if (!props.isQueryEmpty && props.items.length === 0 && !props.isLoading) {
    return (
      <Typography align="center">
        {translate('Finder.bodyNoResultsGiven')}
      </Typography>
    );
  }

  if (props.isLoading) {
    return (
      <Box alignItems="center" display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (props.isQueryEmpty) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {props.items.map((item, index) => {
        return (
          <Grid item key={index} xs={12}>
            <FinderItem user={item} onClick={props.onClick} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const FinderItem = (props) => {
  const classes = useStyles();

  const handleSelect = () => {
    props.onClick(props.user);
  };

  return (
    <ProfileMini
      address={props.user.safeAddress}
      className={classes.searchItem}
      onClick={handleSelect}
    />
  );
};

Finder.propTypes = {
  basePath: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

FinderResults.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isQueryEmpty: PropTypes.bool.isRequired,
  items: PropTypes.array,
  onClick: PropTypes.func.isRequired,
};

FinderItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Finder;
