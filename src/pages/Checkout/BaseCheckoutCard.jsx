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
import { CloseIcon, KeyboardArrowDownIcon } from 'Icons';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

export default function CheckoutCard({
  children,
  collapsedHeight = 100,
  isDisabled = false,
  title,
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
              <Typography variant="h2">{title}</Typography>
            </Grid>
            <Grid item>
              {isOpen ? (
                <IconButton onClick={handleClose} aria-label="close">
                  <CloseIcon fontSize="large" />
                </IconButton>
              ) : (
                <IconButton
                  aria-haspopup="true"
                  color="primary"
                  onClick={handleOpen}
                  disabled={isDisabled || isOpen}
                >
                  <KeyboardArrowDownIcon fontSize="large" />
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
                <PrimaryWallyButton onClick={handleClose} fullWidth>
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
