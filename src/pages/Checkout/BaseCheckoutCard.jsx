import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  IconButton,
  Container,
  Collapse,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

export default function CheckoutCard({
  title,
  collapsedHeight = 100,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box mb={4}>
      <Card>
        <Box p={4}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h2" gutterBottom>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              {isOpen ? (
                <IconButton onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-haspopup="true"
                  color="primary"
                  onClick={handleOpen}
                  disabled={isOpen}
                >
                  <MoreVertIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
          <Collapse
            in={isOpen}
            collapsedHeight={collapsedHeight}
            timeout="auto"
          >
            <Box>{children}</Box>
            <Container maxWidth="sm">
              <Box mt={2}>
                <PrimaryWallyButton
                  onClick={handleClose}
                  fullWidth
                  style={{ padding: '0.5rem 0' }}
                >
                  Save
                </PrimaryWallyButton>
              </Box>
            </Container>
          </Collapse>
        </Box>
      </Card>
    </Box>
  );
}
