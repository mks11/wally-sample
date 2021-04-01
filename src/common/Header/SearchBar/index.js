import React, { useEffect, useState } from 'react';

// API
import { searchProductsByKeyword } from 'api/product';

// Hooks
import useMobileNavMediaQuery from 'hooks/useMobileNavMediaQuery';

// Icons
import { SearchIcon } from 'Icons';

// Material UI
import { Box, CircularProgress, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services
import { logEvent } from 'services/google-analytics';

const CLOSED_WIDTH = '209px';
const OPEN_WIDTH = '320px';
const CLOSED_WIDTH_MOBILE = '380px';
const OPEN_WIDTH_MOBILE = '320px';
const MAX_WIDTH = 320;

function SearchBar() {
  // Local State
  const isMobile = useMobileNavMediaQuery();
  let closedWidth = isMobile ? CLOSED_WIDTH_MOBILE : CLOSED_WIDTH;
  let openWidth = isMobile ? OPEN_WIDTH_MOBILE : OPEN_WIDTH;

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [width, setWidth] = useState(closedWidth);

  // MobX State
  const { routing: routingStore, snackbar: snackbarStore } = useStores();

  useEffect(() => {
    if (!keyword || keyword.length < 3) {
      setResults([]);
      return undefined;
    }

    search();
  }, [keyword]);

  function handleChange(event, value, reason) {
    if (reason === 'select-option') {
      routingStore.push('/shop/products/' + value.product_id);
    }
  }

  function handleInputChange(e, value) {
    setKeyword(value);
  }

  function onClose() {
    setIsOpen(false);
    setWidth(closedWidth);
  }

  function onOpen() {
    setIsOpen(true);
    setWidth(openWidth);
  }

  async function search() {
    try {
      setIsLoading(true);
      logEvent({ category: 'Search', action: 'SearchKeyword', label: keyword });
      const res = await searchProductsByKeyword(keyword);
      setResults(res.data.products);
    } catch (error) {
      snackbarStore.openSnackbar('Search by keyword failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const filterOptions = (options) => {
    return options;
  };

  const classes = makeStyles({
    popper: {
      width: (props) => `${props.width} !important`,
      maxWidth: 304,
    },
    inputRoot: {
      background: '#fff',
      maxWidth: 304,
    },
  })({ width });

  const getCustomNoOptionsText = () => {
    const kw = keyword && keyword.trim && keyword.trim();
    return !kw || kw.length < 3 ? 'Start typing...' : 'No results';
  };

  return (
    <Box
      padding={1}
      width={width}
      maxWidth={MAX_WIDTH}
      display="flex"
      justifyContent="center"
    >
      <Autocomplete
        classes={classes}
        clearOnBlur={false}
        id="product-search"
        filterOptions={filterOptions}
        fullWidth
        getOptionSelected={(option, value) =>
          option.product_name === value.product_name
        }
        getOptionLabel={(option) => option.product_name}
        inputValue={keyword}
        loading={isLoading}
        loadingText={<CircularProgress color="primary" size={20} />}
        onChange={handleChange}
        onClose={onClose}
        onInputChange={handleInputChange}
        onOpen={onOpen}
        open={isOpen}
        options={results}
        noOptionsText={getCustomNoOptionsText()}
        renderInput={(params) => (
          <TextField
            placeholder="Search Products"
            {...params}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: <SearchIcon />,
              type: 'search',
            }}
          />
        )}
        size="small"
      />
    </Box>
  );
}

export default observer(SearchBar);
