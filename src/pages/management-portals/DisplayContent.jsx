import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

export default function DisplayContent({ children }) {
  return (
    <Box overflow="auto" style={{ height: '100%' }}>
      <Box p={4}>
        {children ? (
          children
        ) : (
          <>
            <Typography align="center">
              <Warning fontSize={'large'} color="action" />
            </Typography>
            <Typography variant="body1" align="center" color="textSecondary">
              Select something from the sidebar
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

DisplayContent.propTypes = {
  children: PropTypes.node.isRequired,
};
