import React from 'react';
import { useField } from 'formik';
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';

const FormikTextInput = (props) => {
  const [field, meta] = useField(props);

  return (
    <>
      <TextField error={!!(meta.touched && meta.error)} {...field} {...props} />
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
};

export default FormikTextInput;
