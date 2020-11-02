import React from 'react';
import { RadioGroup } from '@material-ui/core';
import AddressRadioItem from './AddressRadioItem';

export default function AddressList({
  data,
  selected,
  preferred_address,
  onChange,
}) {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <RadioGroup aria-label={'address'} onChange={handleChange}>
      {data.map((addr) => {
        return (
          <AddressRadioItem
            value={addr.address_id}
            address={addr}
            key={addr.address_id}
            selected={selected}
            onChange={onChange}
            isPreferredAddress={preferred_address === addr.address_id}
          />
        );
      })}
    </RadioGroup>
  );
}
