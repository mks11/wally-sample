import React from 'react';
import PropTypes from 'prop-types';

// Components
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';
import { Label } from 'styled-component-lib/InputLabel';

export default function FormikTextInput({
  field,
  error,
  handleInput,
  label,
  labelId,
  ...props
}) {
  const handleChange = (event) => {
    handleInput(field.name, event.target.value);
  };

  return (
    <>
      <Label disabled={props.disabled}>{label}</Label>
      <TextField
        value={field.value || ''}
        onChange={handleChange}
        fullWidth
        multiline
        placeholder={props.placeholder}
        error={error}
      />
      <HelperText>{props.helperText || ' '}</HelperText>
    </>
  );
}

FormikTextInput.propTypes = {
  field: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  label: PropTypes.string,
  labelId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};
