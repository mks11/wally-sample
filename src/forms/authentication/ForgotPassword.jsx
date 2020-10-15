import React from 'react';

// Config
import { support } from 'config';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Typography } from '@material-ui/core';

// CustomComponents
import { TextInput } from 'common/FormikComponents/NonRenderPropAPI';

// Styled Components
import { Label } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import * as Yup from 'yup';

export default function LoginForm() {
  const { modalV2, snackbar, user } = useStores();

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("Email address can't be blank.")
          .email('Invalid email address.'),
      })}
      enableReinitialize={true}
      onSubmit={forgotPassword}
    >
      <Form>
        <Typography variant="h1" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" gutterBottom>
          Forgot your password? No worries!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter your email address and we'll send you instructions to reset it.
        </Typography>
        <Box my={2}>
          <TextInput
            name="email"
            variant="outlined"
            color="primary"
            placeholder="Email Address"
          />
        </Box>
        <Box my={2}>
          <PrimaryWallyButton style={{ padding: '1em 1.5em' }} type="submit">
            <Typography variant="h5" component="span">
              Submit
            </Typography>
          </PrimaryWallyButton>
        </Box>
      </Form>
    </Formik>
  );

  function forgotPassword({ email }, { setSubmitting }) {
    user
      .forgotPassword(email)
      .then(() =>
        snackbar.openSnackbar(
          `Instructions to reset your password have been sent to ${email}.`,
        ),
      )
      .catch(() =>
        snackbar.openSnackbar(
          `Reset password attempt failed. Please contact us at ${support} for support.`,
          'error',
        ),
      )
      .finally(() => {
        setSubmitting(false);
        modalV2.close();
      });
  }
}
