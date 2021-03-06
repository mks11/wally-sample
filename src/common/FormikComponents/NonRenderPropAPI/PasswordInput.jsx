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

const PasswordInput = ({ errorMsg, setErrorMsg, type, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    field.onChange(e);
    if (setErrorMsg) {
      setErrorMsg('');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        error={(meta.touched && meta.error) || errorMsg ? true : false}
        type={showPassword ? 'text' : 'password'}
        {...field}
        value={field.value || ''}
        onChange={handleChange}
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
      <HelperText
        error={(meta.touched && meta.error) || errorMsg ? true : false}
      >
        {(meta.touched && meta.error) || errorMsg
          ? meta.error || errorMsg
          : ' '}
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
