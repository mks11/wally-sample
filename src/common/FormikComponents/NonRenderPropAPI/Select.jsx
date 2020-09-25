import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { Label } from 'styled-component-lib/InputLabel';
import { HelperText } from 'styled-component-lib/HelperText';
import { MenuItem, Select as SelectMui } from '@material-ui/core';

function Select({ label, values = [], valueToDisplayMap, ...props }) {
  const [selectedVal, setSelectedVal] = useState('');
  const [field, meta] = useField(props);

  const handleClick = (val) => {
    setSelectedVal(val);
  };

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <SelectMui
        fullWidth
        id={props.id || props.name}
        error={!!(meta.touched && meta.error)}
        value={selectedVal}
        {...field}
        {...props}
      >
        <MenuItem key={'none'} value="">
          <em>None</em>
        </MenuItem>
        {values.map((val = '') => {
          return (
            <MenuItem key={val} value={val} onClick={() => handleClick(val)}>
              {valueToDisplayMap ? valueToDisplayMap[val] : val}
            </MenuItem>
          );
        })}
      </SelectMui>
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  valueToDisplayMap: PropTypes.object,
};

export default Select;
