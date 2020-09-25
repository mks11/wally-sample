import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

// Material UI
import { InputAdornment, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// Styled Components
import { HelperText } from 'styled-component-lib/HelperText';

const PasswordInput = (props) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        error={!!(meta.touched && meta.error)}
        type={showPassword ? 'text' : 'password'}
        {...field}
        {...props}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
};

export default PasswordInput;

PasswordInput.defaultProps = {
  fullWidth: true, //since mostly this is intended to be used within a Mui Grid
};

PasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
};
