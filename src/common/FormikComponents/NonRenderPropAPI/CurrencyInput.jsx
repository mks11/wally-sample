import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

// npm packages
import NumberFormat from 'react-number-format';

// Material UI
import { TextField } from '@material-ui/core';

// Styled Components
import { HelperText } from 'styled-component-lib/HelperText';

const CurrencyInput = ({ ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <TextField
        error={meta.touched && meta.error ? true : false}
        type="text"
        {...field}
        value={field.value}
        {...props}
        InputProps={{ inputComponent: NumberFormatCustom }}
      />
      <HelperText error={meta.touched && meta.error ? true : false}>
        {meta.touched && meta.error ? meta.error : ' '}
      </HelperText>
    </>
  );
};

export default CurrencyInput;

CurrencyInput.defaultProps = {
  fullWidth: true, //since mostly this is intended to be used within a Mui Grid
};

CurrencyInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
};

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
