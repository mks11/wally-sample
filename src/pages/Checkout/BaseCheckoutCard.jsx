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
import { useTheme } from '@material-ui/core/styles';
import { CloseIcon, KeyboardArrowDownIcon } from 'Icons';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

// Forms
import { HelperText } from 'styled-component-lib/HelperText';
import { useField } from 'formik';

export default function CheckoutCard({
  children,
  collapsedHeight = 100,
  isDisabled = false,
  name,
  title,
}) {
  const [field, meta] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const hasError = meta.touched && meta.error;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box mb={1}>
      <Card
        style={{
          border: hasError
            ? `1px solid ${theme.palette.error.main}`
            : '1px solid transparent',
        }}
      >
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
      <HelperText error={hasError ? true : false}>
        {hasError ? meta.error : ' '}
      </HelperText>
    </Box>
  );
}
