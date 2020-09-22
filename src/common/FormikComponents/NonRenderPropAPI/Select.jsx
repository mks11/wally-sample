import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { Label } from 'styled-component-lib/InputLabel';
import { NativeSelect } from '@material-ui/core';

function Select({ label }) {
  const [meta] = useField(props);
  return (
    <>
      <Label htmlFor={props.id || prop.name}>{label}</Label>
      <NativeSelect />
    </>
  );
}

Select.propTypes = {};

export default Select;
