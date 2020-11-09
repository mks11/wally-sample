import React from 'react';
import PhoneInputMUI from 'common/PhoneInput';
import { useFormikContext, useField } from 'formik';
import { HelperText } from 'styled-component-lib/HelperText';

export default function PhoneInput({ name, ...props }) {
  const { setFieldValue } = useFormikContext();
  const handleChange = (txt) => {
    setFieldValue(name, txt);
  };

  const [field, meta] = useField({ name });
  //drop onChange and value (to prevent override)
  const { onChange, value, ...restField } = field;

  return (
    <>
      <PhoneInputMUI
        onChange={handleChange}
        error={!!(meta.touched && meta.error)}
        {...restField}
        {...props}
      />
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
}
