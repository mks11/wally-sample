import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Typography, Grid, Box } from '@material-ui/core';

function FormWrapper({ children, title }) {
  return (
    <Box p={1} justify="center">
      <Box p={1}>
        <Typography variant="h2" gutterBottom>
          {title}
        </Typography>
      </Box>
      <Box p={1}>{children}</Box>
    </Box>
  );
}

FormWrapper.propTypes = {};

export default FormWrapper;
