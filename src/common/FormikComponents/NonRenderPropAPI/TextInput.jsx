import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';

const FormikTextInput = (props) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        error={!!(meta.touched && meta.error)}
        type={props.type || 'text'}
        {...field}
        value={field.value || ''}
        {...props}
      />
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error ? meta.error : ' '}
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
  label: PropTypes.string,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
};
