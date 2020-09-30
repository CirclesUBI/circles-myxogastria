import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import qs from 'qs';
import {
  Badge,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Input,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, generatePath } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProfileMini from '~/components/ProfileMini';
import QRCodeScanner from '~/components/QRCodeScanner';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import TourWebOfTrustSVG from '%/images/tour-web-of-trust.svg';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import translate from '~/services/locale';
import {
  IconFollow,
  IconScan,
  IconTrustActive,
  IconWorld,
} from '~/styles/icons';
import { SEARCH_PATH } from '~/routes';
import { useQuery } from '~/hooks/url';

const MAX_SEARCH_RESULTS = 10;

const FILTER_DIRECT = Symbol('filterDirect');
const FILTER_EXTERNAL = Symbol('filterExternal');
const FILTER_INDIRECT = Symbol('filterIndirect');

const DEFAULT_FILTER = FILTER_DIRECT;

const QUERY_FILTER_MAP = {
  direct: FILTER_DIRECT,
  indirect: FILTER_INDIRECT,
  external: FILTER_EXTERNAL,
};

const filterToQuery = (filterName) => {
  return Object.keys(QUERY_FILTER_MAP).find((key) => {
    return QUERY_FILTER_MAP[key] === filterName;
  });
};

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
  bottomNavigation: {
    marginBottom: theme.spacing(2),
  },
  bottomNavigationAction: {
    maxWidth: 'none',
  },
  bottomNavigationLabel: {
    marginTop: theme.spacing(1),
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '0.9rem',
    borderBottom: '2px solid transparent',
    '&.Mui-selected': {
      fontSize: '0.9rem',
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
  },
}));

const Finder = ({ onSelect, hasActions, basePath = SEARCH_PATH }) => {
  const classes = useStyles();
  const ref = useRef();

  const history = useHistory();
  const { query: input = '', filter } = useQuery();

  // Check if we already selected a filter via url query param
  const preselectedFilter =
    filter in QUERY_FILTER_MAP ? QUERY_FILTER_MAP[filter] : DEFAULT_FILTER;
  const [selectedFilter, setSelectedFilter] = useState(preselectedFilter);

  const safe = useSelector((state) => state.safe);
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const updateUrl = (newInput, newFilter) => {
    const query = qs.stringify({
      query: newInput,
      filter: filterToQuery(newFilter) || filterToQuery(DEFAULT_FILTER),
    });

    history.replace(`${generatePath(basePath)}?${query}`);
  };

  const handleFilterSelection = (newFilter) => {
    setSelectedFilter(newFilter);
    updateUrl(input, newFilter);
  };

  const onInputChange = (event) => {
    updateUrl(event.target.value, selectedFilter);
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
    const cleanInput = input.trim().replace(/@/g, '');
    setIsQueryEmpty(cleanInput.length === 0);

    if (cleanInput.length === 0) {
      setSearchResults([]);
      return;
    }

    // Shortcut for putting in a valid address directly
    const matched = core.utils.matchAddress(cleanInput);
    if (matched) {
      // Reset current input so we don't run into an redirect loop
      history.replace(generatePath(basePath));
      onSelect(matched);
      return;
    }

    setIsLoading(true);
    debouncedSearch(cleanInput);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <Box display="flex" mb={3}>
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
        hasActions={hasActions}
        isLoading={isLoading}
        isQueryEmpty={isQueryEmpty}
        items={searchResults}
        selectedFilter={selectedFilter}
        onClick={handleSelect}
        onFilterChange={handleFilterSelection}
      />
    </Fragment>
  );
};

const FinderResults = ({ selectedFilter, onFilterChange, ...props }) => {
  // Get our current trust network
  const { network } = useSelector((state) => state.trust);

  // Filter results
  const results = useMemo(() => {
    // Show users trust network when no query is given, otherwise merge search
    // results with what we know from our trust network
    const items = props.isQueryEmpty
      ? network
      : props.items.map((item) => {
          const networkItem = network.find(({ safeAddress }) => {
            return safeAddress === item.safeAddress;
          });

          return {
            ...item,
            ...networkItem,
          };
        });

    return [FILTER_DIRECT, FILTER_INDIRECT, FILTER_EXTERNAL].reduce(
      (acc, filter) => {
        acc[filter] = items.filter((item) => {
          switch (filter) {
            case FILTER_DIRECT:
              return item.isIncoming;
            case FILTER_INDIRECT:
              return item.isOutgoing && !item.isIncoming;
            case FILTER_EXTERNAL:
              return !item.isIncoming && !item.isOutgoing;
            default:
              return true;
          }
        });
        return acc;
      },
      {},
    );
  }, [props.isQueryEmpty, props.items, network]);

  const handleFilterChange = useCallback(
    (newFilter) => {
      onFilterChange(newFilter);
    },
    [onFilterChange],
  );

  // Automatically select the filter with the only results
  useEffect(() => {
    if (!props.isLoading && !props.isQueryEmpty) {
      const filterRank = [FILTER_DIRECT, FILTER_INDIRECT, FILTER_EXTERNAL]
        .map((key) => {
          return {
            key,
            length: results[key].length,
          };
        })
        .sort(({ length: itemA }, { length: itemB }) => {
          return itemB - itemA;
        });

      const bestFilter = filterRank[0].key;
      if (
        selectedFilter !== bestFilter &&
        filterRank[1].length === 0 &&
        filterRank[2].length === 0
      ) {
        handleFilterChange(bestFilter);
      }
    }
  }, [props.isLoading, props.isQueryEmpty]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!props.isQueryEmpty && props.items.length === 0 && !props.isLoading) {
    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        height={220}
        justifyContent="space-between"
        mt={5}
      >
        <TourWebOfTrustSVG />
        <Typography align="center">
          {translate('Finder.bodyNoResultsGiven')}
        </Typography>
      </Box>
    );
  }

  return (
    <Fragment>
      <TabNavigation
        value={selectedFilter}
        onChange={(event, newFilter) => {
          handleFilterChange(newFilter);
        }}
      >
        <TabNavigationAction
          icon={
            <Badge badgeContent={results[FILTER_DIRECT].length} color="primary">
              <IconTrustActive />
            </Badge>
          }
          label={translate('Finder.bodyFilterDirect')}
          value={FILTER_DIRECT}
        />
        <TabNavigationAction
          icon={
            <Badge
              badgeContent={results[FILTER_INDIRECT].length}
              color="primary"
            >
              <IconFollow />
            </Badge>
          }
          label={translate('Finder.bodyFilterIndirect')}
          value={FILTER_INDIRECT}
        />
        <TabNavigationAction
          icon={
            <Badge
              badgeContent={results[FILTER_EXTERNAL].length}
              color="primary"
            >
              <IconWorld />
            </Badge>
          }
          label={translate('Finder.bodyFilterExternal')}
          value={FILTER_EXTERNAL}
        />
      </TabNavigation>
      {results[selectedFilter].length === 0 && !props.isLoading && (
        <Typography align="center">
          {translate('Finder.bodyNoResultsGiven')}
        </Typography>
      )}
      {props.isLoading && (
        <Box alignItems="center" display="flex" justifyContent="center">
          {' '}
          <CircularProgress />{' '}
        </Box>
      )}
      {!props.isLoading && (
        <Grid container spacing={2}>
          {results[selectedFilter].map((item, index) => {
            return (
              <Grid item key={index} xs={12}>
                <FinderItem
                  hasActions={props.hasActions}
                  user={item}
                  onClick={props.onClick}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Fragment>
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
      hasActions={props.hasActions}
      onClick={handleSelect}
    />
  );
};

Finder.propTypes = {
  basePath: PropTypes.string,
  hasActions: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

FinderResults.propTypes = {
  hasActions: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isQueryEmpty: PropTypes.bool.isRequired,
  items: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  selectedFilter: PropTypes.symbol.isRequired,
};

FinderItem.propTypes = {
  hasActions: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Finder;
