import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as CheckboxMui, FormControlLabel } from '@material-ui/core';
import { useFormikContext } from 'formik';

function Checkbox({ isChecked, label, name, ...rest }) {
  const [isSelected, setSelected] = useState(isChecked || false);

  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    setSelected(event.target.checked);
    setFieldValue(name, event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <CheckboxMui checked={isSelected} onChange={handleChange} {...rest} />
      }
      label={label}
    />
  );
}

export default Checkbox;

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
