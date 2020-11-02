import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox as CheckboxMui, FormControlLabel } from '@material-ui/core';
import { useFormikContext } from 'formik';
import Product from 'pages/Mainpage/Product';

function Checkbox({ label, name, ...rest }) {
  const [isSelected, setSelected] = useState(false);

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
