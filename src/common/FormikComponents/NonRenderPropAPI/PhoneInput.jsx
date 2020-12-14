import React, { forwardRef } from 'react';

// Phone Number Utilities and Components
import PhoneInput from 'react-phone-number-input/input';
import metadata from 'metadata.custom.json';

import { useFormikContext, useField } from 'formik';
import { TextField } from '@material-ui/core';
import { HelperText } from 'styled-component-lib/HelperText';

const CustomPhoneInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} {...props} />;
});

export default function PhoneNumberInput({ name, ...props }) {
  const { setFieldValue } = useFormikContext();

  const handleChange = (value) => {
    if (value) {
      const val = value.substr(2);
      setFieldValue(name, val);
    }
  };

  const [field, meta] = useField({ name });
  //drop onChange and value (to prevent override)
  const { onChange, value, ...rest } = field;

  return (
    <>
      <PhoneInput
        country="US"
        inputComponent={CustomPhoneInput}
        metadata={metadata}
        onChange={handleChange}
        error={meta.touched && meta.error}
        {...rest}
        {...props}
        value={'+1' + value}
      />
      <HelperText error={meta.touched && meta.error}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
}
