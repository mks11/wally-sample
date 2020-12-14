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

// MobX
import { useStores } from 'hooks/mobx';

export default function CollapseCard({
  children,
  collapsedHeight = 100,
  elevation = 3,
  name,
  onSave,
  showSaveButton,
  title,
}) {
  const { snackbar } = useStores();
  const [field, meta] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const hasError = meta.touched && meta.error;
  const transitionTime = 500;
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSave = () => {
    setIsOpen(false);
    if (onSave && field.value) {
      onSave(field.value);
      setTimeout(
        () => snackbar.openSnackbar(title + ' saved.', 'success', 3000),
        transitionTime,
      );
    }
  };

  return (
    <Box mb={2}>
      <Card
        style={{
          border: hasError
            ? `1px solid ${theme.palette.error.main}`
            : '1px solid transparent',
        }}
        elevation={elevation}
      >
        <Box p={2} pb={0}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography component="h1" variant="h3">
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <PrimaryTextButton
                onClick={isOpen ? handleSave : handleOpen}
                style={{ width: '86px' }}
              >
                {isOpen ? 'Save' : 'Change'}
              </PrimaryTextButton>
            </Grid>
          </Grid>
          <Collapse
            in={isOpen}
            collapsedHeight={collapsedHeight}
            timeout={transitionTime}
          >
            <Box>{children}</Box>
            {showSaveButton ? (
              <Container maxWidth="xs" disableGutters>
                <Box mt={2} px={2}>
                  <PrimaryWallyButton onClick={handleSave} fullWidth>
                    Save
                  </PrimaryWallyButton>
                </Box>
              </Container>
            ) : null}
          </Collapse>
          <HelperText error={hasError ? true : false}>
            {hasError ? meta.error : ' '}
          </HelperText>
        </Box>
      </Card>
    </Box>
  );
}
