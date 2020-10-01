import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';

const FormikTextInput = ({ errorMsg, setErrorMsg, type, ...props }) => {
  const [field, meta] = useField(props);
  const handleChange = (e) => {
    field.onChange(e);
    if (setErrorMsg) {
      setErrorMsg('');
    }
  };

  return (
    <>
      <TextField
        error={(meta.touched && meta.error) || errorMsg ? true : false}
        type={type || 'text'}
        {...field}
        value={field.value || ''}
        onChange={handleChange}
        {...props}
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

export default FormikTextInput;

FormikTextInput.defaultProps = {
  fullWidth: true, //since mostly this is intended to be used within a Mui Grid
};

FormikTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
};
