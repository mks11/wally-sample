import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import { useFormikContext } from 'formik';
import { Box, InputAdornment, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';

// Components
import { Label } from 'styled-component-lib/InputLabel';

export default function FormikPlacesAutoComplete({ names, mode = 'edit' }) {
  const [address, setAddress] = useState('');
  const { setFieldValue } = useFormikContext();

  const handleChange = (address) => {
    setAddress(address);
  };

  const setFormikValuesByName = (address) => {
    names.forEach((name) => {
      setFieldValue(name, address[name]);
    });
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        const address = getAddressComponents(results[0]);
        setFormikValuesByName(address);
      })
      .catch((err) => console.error('Error', err));
  };

  return (
    <>
      <Label>Search for an address</Label>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        debounce={600}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div style={{ position: 'relative' }}>
            <TextField
              {...getInputProps({
                // readOnly: mode === 'edit',
                autoComplete: 'off',
                placeholder: 'Search US addresses',
              })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />
            <Box
              position="absolute"
              border={
                suggestions && suggestions.length
                  ? '1px solid rgb(118, 118, 118)'
                  : 'none'
              }
              background="#fff"
              width="100%"
              zIndex={10}
            >
              {suggestions.map((suggestion, idx) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                    key={`suggestion-${idx}`}
                  >
                    <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                    <small>
                      {suggestion.formattedSuggestion.secondaryText}
                    </small>
                  </div>
                );
              })}
            </Box>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
}

function getAddressComponents(place) {
  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };

  // Select the correct address components to build out the address with.
  const { address_components } = place;
  const address = {};
  for (let component of address_components) {
    const addressType = component.types[0];
    const addressComponent = componentForm[addressType];
    if (addressComponent) {
      const val = component[addressComponent];
      address[addressType] = val;
    }
  }

  return {
    streetAddress: `${address.street_number} ${address.route}`,
    city: address.locality || address.administrative_area_level_1,
    state: address.administrative_area_level_1,
    zip: address.postal_code || '',
    country: address.country,
  };
}

FormikPlacesAutoComplete.propTypes = {
  names: PropTypes.array.isRequired,
};
