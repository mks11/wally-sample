import React from 'react';
import { Box, Typography, Grid } from '@material-ui/core';
import { Warning } from '@material-ui/icons';

export default function DisplayContent({ content = {} }) {
  if (!content.title) {
    return (
      <Box p={5}>
        <Typography align="center">
          <Warning fontSize={'large'} color="action" />
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Select something from the sidebar
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={1}>
      <Box p={1}>
        <Typography variant="h3"> {content.title} </Typography>
      </Box>
      <Box p={1}>
        <Typography variant="body1">{content.body}</Typography>
      </Box>
    </Box>
  );
}
