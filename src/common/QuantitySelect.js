import React from 'react';
import { FormGroup, Input } from 'reactstrap';

const QuantitySelect = ({ value, onSelectChange, options, price_unit }) => {
  return (
    <FormGroup style={{ maxWidth: '140px' }}>
      <Input
        type="select"
        value={value}
        onChange={onSelectChange}
        disabled={options && !options.length ? true : false}
      >
        {options.map((v, i) => (
          <option key={i} value={v}>{`${v} ${price_unit}`}</option>
        ))}
      </Input>
    </FormGroup>
  );
};

export default QuantitySelect;
