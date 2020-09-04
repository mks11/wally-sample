import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import { useFormikContext } from 'formik';

export default function PlacesAutoComplete({ names, mode = 'edit' }) {
  const [address, setAddress] = useState('');
  const { values: formikValues, setFieldValue } = useFormikContext();

  const handleChange = (address) => {
    setAddress(address);
  };

  const encodeAddressFromValues = () => {
    const { streetAddress, unit, city, state, country } = formikValues;
    if (unit) {
      return `${streetAddress}, ${unit}, ${city}, ${state} ${country}`;
    } else {
      return `${streetAddress}, ${city}, ${state} ${country}`;
    }
  };

  useEffect(() => {
    setAddress(encodeAddressFromValues());
  }, []);

  const setFormikValuesByName = (address) => {
    names.forEach((name) => {
      setFieldValue(name, address[name]);
    });
  };

  const handleSelect = (address) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((results) => {
        const address = getAddressComponents(results[0]);
        setFormikValuesByName(address);
      })
      .catch((err) => console.error('Error', err));
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      debounce={600}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ position: 'relative' }}>
          <input
            {...getInputProps({
              // readOnly: mode === 'edit',
              autoComplete: 'off',
              placeholder: 'Delivery to...',
              className:
                'aw-input--control aw-input--control-large aw-input--left location-search-input  aw-input--location aw-input--bordered mt-3 form-control',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {suggestions.map((suggestion) => {
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
                >
                  <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                  <small>{suggestion.formattedSuggestion.secondaryText}</small>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}

function getAddressComponents(place) {
  const componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name',
  };

  const address = {};

  for (let i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      const val = place.address_components[i][componentForm[addressType]];
      address[addressType] = val;
    }
  }

  const city = address.locality || address.administrative_area_level_1;
  const state = address.administrative_area_level_1;
  const country = address.country;
  const zip = address.postal_code || '';
  const streetAddress = `${address.street_number} ${address.route}`; //TODO more testing

  return { city, state, country, zip, streetAddress };
}

PlacesAutoComplete.propTypes = {
  names: PropTypes.oneOf[('city', 'state', 'country', 'zip', 'streetAddress')],
};
