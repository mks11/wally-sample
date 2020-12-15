import React, { useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

export default function Banner({ children }) {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(false);
  };

  return show ? (
    <Box py={2}>
      <Grid container justify="space-between">
        <Grid item xs={11}>
          {children}
        </Grid>
        <Grid
          item
          xs={1}
          style={{
            display: 'flex',
          }}
          justify="center"
        >
          <CloseIcon onClick={handleClick} />
        </Grid>
      </Grid>
    </Box>
  ) : null;
}
