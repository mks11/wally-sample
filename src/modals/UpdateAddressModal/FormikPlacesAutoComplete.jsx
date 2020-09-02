import React, { useState } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  // getLatLng,
} from 'react-places-autocomplete';
import { useFormikContext } from 'formik';

export default function PlacesAutoComplete({ name, mode = 'edit' }) {
  const [address, setAddress] = useState({});
  const { values, setFieldValue } = useFormikContext();

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleSelect = ({ address }) => {
    setAddress(address);
    geocodeByAddress(address)
      .then((result) => {
        const { city, state, country, zip } = getAddressComponents(results[0]);
      })
      .catch((err) => console.error('Error', err)); //todo handle properly
  };

  return (
    <PlacesAutocomplete
      value={values.address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ position: 'relative' }}>
          <input
            {...getInputProps({
              readOnly: mode === 'edit',
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

  return { city, state, country, zip };
}
