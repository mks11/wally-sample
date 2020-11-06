import React from 'react';
import { RadioGroup } from '@material-ui/core';
import AddressRadioItem from './AddressRadioItem';
import Address from './Address';

export default function AddressList({
  addresses,
  selected,
  preferred_address,
  onChange,
  isLocked,
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (isLocked) {
    return <Address address={selected} />;
  }

  return (
    <RadioGroup aria-label={'address'} onChange={handleChange}>
      {addresses.map((addr) => {
        return (
          <AddressRadioItem
            value={addr.address_id}
            address={addr}
            key={addr.address_id}
            selected_id={selected._id}
            onChange={onChange}
            isPreferredAddress={preferred_address === addr.address_id}
          />
        );
      })}
    </RadioGroup>
  );
}
