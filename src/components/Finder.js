import { Box, CircularProgress, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import qs from 'qs';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';

import { SEARCH_PATH } from '~/routes';

import TourWebOfTrustSVG from '%/images/web-of-trust.svg';
import BadgeTab from '~/components/BadgeTab';
import Button from '~/components/Button';
import Input from '~/components/Input';
import ProfileMini from '~/components/ProfileMini';
import TabNavigation from '~/components/TabNavigation';
import TabNavigationAction from '~/components/TabNavigationAction';
import { useUpdateLoop } from '~/hooks/update';
import { useQuery } from '~/hooks/url';
import core from '~/services/core';
import translate from '~/services/locale';
import { checkTrustState } from '~/store/trust/actions';
import {
  IconFollow,
  IconNoSearchResult,
  IconTrustedDirectly,
  IconWorld,
} from '~/styles/icons';
import debounce from '~/utils/debounce';

const MAX_SEARCH_RESULTS = 10;
const PAGE_SIZE = 20;

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
  searchItem: {
    cursor: 'pointer',
    boxShadow: theme.custom.shadows.gray,
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
  noSearchResultContainer: {
    marginTop: '80px',
    '& p': {
      color: theme.custom.colors.violet,
    },
  },
  noSearchResultIconContainer: {
    textAlign: 'center',
    marginBottom: '30px',
    '& svg': {
      fontSize: '152px',
    },
  },
}));

const Finder = ({
  onSelect,
  hasActions,
  filteredSafeAddresses = [],
  isSharedWalletCreation,
  basePath = SEARCH_PATH,
}) => {
  const dispatch = useDispatch();
  const safe = useSelector((state) => state.safe);

  const history = useHistory();
  const { filter, query: input = '' } = useQuery();

  useUpdateLoop(async () => {
    await dispatch(checkTrustState());
  });

  // Check if we already selected a filter via url query param
  const preselectedFilter =
    filter in QUERY_FILTER_MAP ? QUERY_FILTER_MAP[filter] : DEFAULT_FILTER;
  const [selectedFilter, setSelectedFilter] = useState(preselectedFilter);

  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(
    cleanInputStr(input).length === 0,
  );
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

    // Remove ourselves from results and optionally safes we passed as a prop
    const filteredItems = items.filter((item) => {
      return (
        item.safeAddress !== safe.currentAccount &&
        !filteredSafeAddresses.includes(item.safeAddress)
      );
    });

    return [FILTER_DIRECT, FILTER_INDIRECT, FILTER_EXTERNAL].reduce(
      (acc, filter) => {
        acc[filter] = filteredItems.filter((item) => {
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
  }, [
    isQueryEmpty,
    searchResults,
    network,
    filteredSafeAddresses,
    safe.currentAccount,
  ]);

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
      const isCurrentFilterEmpty =
        filterRank.find(({ key }) => {
          return key === selectedFilter;
        }).length === 0;

      if (selectedFilter !== bestFilter && isCurrentFilterEmpty) {
        handleFilterSelection(bestFilter);
      }
    }
  }, [isLoading, isQueryEmpty]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <Box mb={4}>
        <FinderSearchBar
          basePath={basePath}
          input={input}
          selectedFilter={selectedFilter}
          onInputChange={handleInputChange}
          onLoadingChange={handleLoadingChange}
          onResultsChange={handleSearchResultsChange}
          onSelect={onSelect}
        />
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
          isSharedWalletCreation={isSharedWalletCreation}
          selectedFilter={selectedFilter}
          onSelect={onSelect}
        />
      )}
    </Fragment>
  );
};

const FinderSearchBar = ({
  basePath,
  input,
  onInputChange,
  onLoadingChange,
  onResultsChange,
  onSelect,
}) => {
  const history = useHistory();
  const safe = useSelector((state) => state.safe);
  const isOrganization = safe?.isOrganization;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      // Search the database for similar usernames
      const response = await core.user.search(query);

      const result = response.data
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
      fullWidth
      id="search"
      isOrganization={isOrganization}
      label={translate('Finder.formLabel')}
      placeholder={translate('Finder.formSearch')}
      value={input}
      onChange={onInputChange}
    />
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
          <BadgeTab
            badgeContent={filterResults[FILTER_DIRECT].length}
            icon={IconTrustedDirectly}
            isActive={selectedFilter === FILTER_DIRECT}
          />
        }
        label={translate('Finder.bodyFilterDirect')}
        value={FILTER_DIRECT}
      />
      <TabNavigationAction
        icon={
          <BadgeTab
            badgeContent={filterResults[FILTER_INDIRECT].length}
            icon={IconFollow}
            isActive={selectedFilter === FILTER_INDIRECT}
          />
        }
        label={translate('Finder.bodyFilterIndirect')}
        value={FILTER_INDIRECT}
      />
      <TabNavigationAction
        icon={
          <BadgeTab
            badgeContent={filterResults[FILTER_EXTERNAL].length}
            icon={IconWorld}
            isActive={selectedFilter === FILTER_EXTERNAL}
          />
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
  isSharedWalletCreation,
}) => {
  const [limit, setLimit] = useState({
    [FILTER_DIRECT]: PAGE_SIZE,
    [FILTER_EXTERNAL]: PAGE_SIZE,
    [FILTER_INDIRECT]: PAGE_SIZE,
  });
  const classes = useStyles();

  const handleSelect = (user) => {
    onSelect(user.safeAddress);
  };

  const handleLoadMore = () => {
    setLimit({
      ...limit,
      [selectedFilter]: limit[selectedFilter] + PAGE_SIZE,
    });
  };

  return (
    <Fragment>
      {filterResults[selectedFilter].length === 0 && !isLoading && (
        <Box className={classes.noSearchResultContainer}>
          <Box className={classes.noSearchResultIconContainer}>
            <IconNoSearchResult />
          </Box>
          <Typography align="center">
            {translate('Finder.bodyNoResultsGiven')}
          </Typography>
        </Box>
      )}
      {isLoading && (
        <Box alignItems="center" display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      )}
      {!isLoading && (
        <Fragment>
          <Grid container spacing={2}>
            {filterResults[selectedFilter]
              .slice(0, limit[selectedFilter])
              .map((item, index) => {
                return (
                  <Grid item key={index} xs={12}>
                    <FinderResultsItem
                      hasActions={hasActions}
                      isSharedWalletCreation={isSharedWalletCreation}
                      user={item}
                      onClick={handleSelect}
                    />
                  </Grid>
                );
              })}
          </Grid>
          {filterResults[selectedFilter].length > limit[selectedFilter] && (
            <Box mt={2}>
              <Button fullWidth isOutline onClick={handleLoadMore}>
                {translate('Finder.buttonLoadMore')}
              </Button>
            </Box>
          )}
        </Fragment>
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
      isSharedWalletCreation={props.isSharedWalletCreation}
      onClick={handleSelect}
    />
  );
};

Finder.propTypes = {
  basePath: PropTypes.string,
  filteredSafeAddresses: PropTypes.arrayOf(PropTypes.string),
  hasActions: PropTypes.bool,
  isSharedWalletCreation: PropTypes.bool,
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

FinderFilter.propTypes = {
  filterResults: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedFilter: PropTypes.symbol.isRequired,
};

FinderResults.propTypes = {
  filterResults: PropTypes.object.isRequired,
  hasActions: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  isSharedWalletCreation: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selectedFilter: PropTypes.symbol.isRequired,
};

FinderResultsItem.propTypes = {
  hasActions: PropTypes.bool,
  isSharedWalletCreation: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Finder;
