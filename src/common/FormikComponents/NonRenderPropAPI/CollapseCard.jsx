import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Container,
  Collapse,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import {
  PrimaryTextButton,
  PrimaryWallyButton,
} from 'styled-component-lib/Buttons';

// Forms
import { HelperText } from 'styled-component-lib/HelperText';
import { useField } from 'formik';

export default function CheckoutCard({
  children,
  collapsedHeight = 100,
  isDisabled = false,
  name,
  onSave,
  showSaveButton,
  title,
}) {
  const [field, meta] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const hasError = meta.touched && meta.error;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSave = () => {
    onSave && onSave(field.value);
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
              <PrimaryTextButton
                onClick={isOpen ? handleSave : handleOpen}
                style={{ width: '86px' }}
              >
                {isOpen ? 'Close' : 'Change'}
              </PrimaryTextButton>
            </Grid>
          </Grid>
          <Collapse
            in={isOpen}
            collapsedHeight={collapsedHeight}
            timeout="auto"
          >
            <Box>{children}</Box>
            {showSaveButton ? (
              <Container maxWidth="sm" disableGutters>
                <Box mt={2} px={2}>
                  <PrimaryWallyButton onClick={handleSave} fullWidth>
                    Save
                  </PrimaryWallyButton>
                </Box>
              </Container>
            ) : null}
          </Collapse>
        </Box>
      </Card>
      <HelperText error={hasError ? true : false}>
        {hasError ? meta.error : ' '}
      </HelperText>
    </Box>
  );
}
