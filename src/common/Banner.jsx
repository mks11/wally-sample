import React, { useState } from 'react';
import { Box, Container, Grid, IconButton } from '@material-ui/core';
import { CloseIcon } from 'Icons';

export default function Banner({ children }) {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(false);
  };

  return show ? (
    <Box py={2} style={{ backgroundColor: '#000' }}>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={11}>
            {children}
          </Grid>
          <Grid item xs={1}>
            <Box display="flex" justifyContent="center">
              <IconButton onClick={handleClick}>
                <CloseIcon style={{ color: '#fff' }} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  ) : null;
}
