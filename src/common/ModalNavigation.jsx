import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// npm package components
import { Box, Button, Typography } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export function BackButton({ children }) {
  const { modalV2 } = useStores();
  const goBack = () => {
    modalV2.open(children);
  };

  return (
    <Box mb={'1em'}>
      <Button
        aria-label="back"
        onClick={goBack}
        startIcon={<ChevronLeftIcon />}
        style={{ paddingLeft: '0', paddingRight: '0' }}
      >
        <Typography variant="h4" component="span">
          Back
        </Typography>
      </Button>
    </Box>
  );
}
