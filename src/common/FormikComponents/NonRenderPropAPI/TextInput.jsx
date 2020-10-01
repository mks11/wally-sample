import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';

const FormikTextInput = (props) => {
  const [field, meta] = useField(props);
  const handleChange = (e) => {
    field.onChange(e);
    if (props.setErrorMsg) {
      props.setErrorMsg('');
    }
  };

  return (
    <>
      <TextField
        error={(meta.touched && meta.error) || props.errorMsg}
        type={props.type || 'text'}
        {...field}
        onChange={handleChange}
        {...props}
      />
      <HelperText error={(meta.touched && meta.error) || props.errorMsg}>
        {(meta.touched && meta.error) || props.errorMsg
          ? meta.error || props.errorMsg
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
