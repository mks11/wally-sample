import React from 'react';
import { Box } from '@material-ui/core';

export default function PageSection({ children }) {
  return (
    <Box component="section" py={2}>
      {children}
    </Box>
  );
}
