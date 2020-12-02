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
      {addresses.map((address) => (
        <AddressRadioItem
          key={address._id}
          address={address}
          isPreferredAddress={defaultAddressId === address._id}
          selected={selected}
        />
      ))}
    </RadioGroup>
  );
}
