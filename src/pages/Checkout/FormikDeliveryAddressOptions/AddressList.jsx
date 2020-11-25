import React from 'react';
import { RadioGroup } from '@material-ui/core';
import AddressRadioItem from './AddressRadioItem';

export default function AddressList({
  addresses,
  defaultAddressId,
  name,
  onChange,
  selected,
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <RadioGroup aria-label={'address'} name={name} onChange={handleChange}>
      {addresses.map((address) => {
        // Stringify the address to enable the handle select method to be used directly
        // with address data from the user's list of addresses and from API responses
        const value = JSON.stringify(address);
        return (
          <AddressRadioItem
            key={address.address_id}
            address={address}
            isPreferredAddress={defaultAddressId === address.address_id}
            selected={selected}
            value={value}
          />
        );
      })}
    </RadioGroup>
  );
}
