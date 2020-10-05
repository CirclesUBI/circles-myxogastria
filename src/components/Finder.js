import PropTypes from 'prop-types';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
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

function cleanInputStr(value) {
  return value.trim().replace(/@/g, '');
}

function filterToQuery(filterName) {
  return Object.keys(QUERY_FILTER_MAP).find((key) => {
    return QUERY_FILTER_MAP[key] === filterName;
  });
}

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
  const history = useHistory();
  const { filter, query: input = '' } = useQuery();

  // Check if we already selected a filter via url query param
  const preselectedFilter =
    filter in QUERY_FILTER_MAP ? QUERY_FILTER_MAP[filter] : DEFAULT_FILTER;
  const [selectedFilter, setSelectedFilter] = useState(preselectedFilter);

  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
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

  const handleLoadingChange = (newState) => {
    setIsLoading(newState);
  };

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    updateUrl(newValue, selectedFilter);
    setIsQueryEmpty(cleanInputStr(newValue).length === 0);
  };

  const handleSearchResultsChange = (newResults) => {
    setSearchResults(newResults);
  };

  // Get our current trust network
  const { network } = useSelector((state) => state.trust);

  // Filter results
  const filterResults = useMemo(() => {
    // Show users trust network when no query is given, otherwise merge search
    // results with what we know from our trust network
    const items = isQueryEmpty
      ? network
      : searchResults.map((item) => {
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
  }, [isQueryEmpty, searchResults, network]);

  // Automatically select the filter with the only results
  useEffect(() => {
    if (!isLoading && !isQueryEmpty) {
      const filterRank = [FILTER_DIRECT, FILTER_INDIRECT, FILTER_EXTERNAL]
        .map((key) => {
          return {
            key,
            length: filterResults[key].length,
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
        handleFilterSelection(bestFilter);
      }
    }
  }, [isLoading, isQueryEmpty]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <Box display="flex" mb={3}>
        <FinderSearchBar
          basePath={basePath}
          input={input}
          selectedFilter={selectedFilter}
          onInputChange={handleInputChange}
          onLoadingChange={handleLoadingChange}
          onResultsChange={handleSearchResultsChange}
          onSelect={onSelect}
        />
        <FinderQRCodeScanner onSelect={onSelect} />
      </Box>
      <FinderFilter
        filterResults={filterResults}
        selectedFilter={selectedFilter}
        onChange={handleFilterSelection}
      />
      {!isQueryEmpty && searchResults.length === 0 && !isLoading ? (
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
      ) : (
        <FinderResults
          filterResults={filterResults}
          hasActions={hasActions}
          isLoading={isLoading}
          selectedFilter={selectedFilter}
          onSelect={onSelect}
        />
      )}
    </Fragment>
  );
};

const FinderSearchBar = ({
  basePath,
  onLoadingChange,
  onResultsChange,
  onInputChange,
  input,
  onSelect,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

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

      onResultsChange(result);
      onLoadingChange(false);
    }),
    [],
  );

  useEffect(() => {
    const cleanInput = cleanInputStr(input);

    if (cleanInput.length === 0) {
      onResultsChange([]);
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

    onLoadingChange(true);
    debouncedSearch(cleanInput);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      autoComplete="off"
      autoFocus
      className={classes.searchInput}
      disableUnderline={true}
      fullWidth
      id="search"
      placeholder={translate('Finder.formSearch')}
      value={input}
      onChange={onInputChange}
    />
  );
};

const FinderQRCodeScanner = ({ onSelect }) => {
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleScan = (address) => {
    setIsScannerOpen(false);
    onSelect(address);
  };

  const handleScannerError = () => {
    setIsScannerOpen(false);
  };

  const handleScannerOpen = () => {
    setIsScannerOpen(true);
  };

  const handleScannerClose = () => {
    setIsScannerOpen(false);
  };

  return (
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
  );
};

const FinderFilter = ({ filterResults, selectedFilter, onChange }) => {
  return (
    <TabNavigation
      value={selectedFilter}
      onChange={(event, newFilter) => {
        onChange(newFilter);
      }}
    >
      <TabNavigationAction
        icon={
          <Badge
            badgeContent={filterResults[FILTER_DIRECT].length}
            color="primary"
          >
            <IconTrustActive />
          </Badge>
        }
        label={translate('Finder.bodyFilterDirect')}
        value={FILTER_DIRECT}
      />
      <TabNavigationAction
        icon={
          <Badge
            badgeContent={filterResults[FILTER_INDIRECT].length}
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
            badgeContent={filterResults[FILTER_EXTERNAL].length}
            color="primary"
          >
            <IconWorld />
          </Badge>
        }
        label={translate('Finder.bodyFilterExternal')}
        value={FILTER_EXTERNAL}
      />
    </TabNavigation>
  );
};

const FinderResults = ({
  filterResults,
  hasActions,
  isLoading,
  onSelect,
  selectedFilter,
}) => {
  const handleSelect = (user) => {
    onSelect(user.safeAddress);
  };

  return (
    <Fragment>
      {filterResults[selectedFilter].length === 0 && !isLoading && (
        <Typography align="center">
          {translate('Finder.bodyNoResultsGiven')}
        </Typography>
      )}
      {isLoading && (
        <Box alignItems="center" display="flex" justifyContent="center">
          {' '}
          <CircularProgress />{' '}
        </Box>
      )}
      {!isLoading && (
        <Grid container spacing={2}>
          {filterResults[selectedFilter].map((item, index) => {
            return (
              <Grid item key={index} xs={12}>
                <FinderResultsItem
                  hasActions={hasActions}
                  user={item}
                  onClick={handleSelect}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Fragment>
  );
};

const FinderResultsItem = (props) => {
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

FinderSearchBar.propTypes = {
  basePath: PropTypes.string.isRequired,
  input: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onLoadingChange: PropTypes.func.isRequired,
  onResultsChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

FinderQRCodeScanner.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

FinderFilter.propTypes = {
  filterResults: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedFilter: PropTypes.symbol.isRequired,
};

FinderResults.propTypes = {
  filterResults: PropTypes.object.isRequired,
  hasActions: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedFilter: PropTypes.symbol.isRequired,
};

FinderResultsItem.propTypes = {
  hasActions: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Finder;
