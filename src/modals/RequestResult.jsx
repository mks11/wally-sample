import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
export default function RequestResult({ children, hasError, title }) {
  const theme = useTheme();
  return (
    <Box>
      {title && (
        <Typography
          variant="h1"
          style={{
            color: hasError
              ? theme.palette.error.main
              : theme.palette.success.main,
          }}
          gutterBottom
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

RequestResult.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.node.isRequired,
  ]),
  hasError: PropTypes.bool,
  title: PropTypes.string.isRequired,
};
