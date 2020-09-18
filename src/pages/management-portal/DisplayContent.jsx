import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

export default function DisplayContent({ children }) {
  return (
    <Box flex={3} overflow="auto">
      {children ? (
        <Box p={1}>{children}</Box>
      ) : (
        <Box p={5}>
          <Typography align="center">
            <Warning fontSize={'large'} color="action" />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            Select something from the sidebar
          </Typography>
        </Box>
      )}
    </Box>
  );
}
