import React from 'react';
import { RadioGroup } from '@material-ui/core';
import AddressRadioItem from './AddressRadioItem';
import Address from './Address';

export default function AddressList({
  addresses,
  defaultAddressId,
  isLocked,
  onChange,
  selected,
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (isLocked) {
    return <Address address={selected} />;
  }

  return (
    <RadioGroup aria-label={'address'} onChange={handleChange}>
      {addresses.map((address) => {
        // Stringify the address to enable the handle select method to be used directly
        // with address data from the user's list of addresses and from API responses
        const value = JSON.stringify(address);
        return (
          <AddressRadioItem
            key={address.address_id}
            address={address}
            isPreferredAddress={defaultAddressId === address.address_id}
            onChange={onChange}
            selected={selected}
            value={value}
          />
        );
      })}
    </RadioGroup>
  );
}
