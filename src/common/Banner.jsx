import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@material-ui/core';
import { CloseIcon } from 'Icons';

export default function Banner({ children }) {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(false);
  };

  return show ? (
    <Box py={2}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={11}>
          {children}
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="center">
            <IconButton onClick={handleClick}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : null;
}
