import React from 'react';

// Config
import { support } from 'config';
import { logModalView } from 'services/google-analytics';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Button, Grid, Typography } from '@material-ui/core';

// CustomComponents
import {
  TextInput,
  PasswordInput,
} from 'common/FormikComponents/NonRenderPropAPI';
import FBLogin from 'common/FBLogin';

// Styled Components
import { Label } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import * as Yup from 'yup';

// Forms
import ForgotPassword from 'forms/authentication/ForgotPassword';
import SignupForm from 'forms/authentication/SignupForm';

export default function LoginForm() {
  const { modalV2, routing, snackbar, user } = useStores();

  return (
    <Box>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          email: Yup.string()
            .required("Email address can't be blank.")
            .email('Invalid email address.'),
          password: Yup.string().required("Password can't be blank."),
        })}
        enableReinitialize={true}
        onSubmit={login}
      >
        <Form>
          <Typography variant="h1" gutterBottom>
            Log In
          </Typography>
          <Box my={2}>
            <Label>Email Address</Label>
            <TextInput
              name="email"
              variant="outlined"
              color="primary"
              placeholder="Email Address"
            />
          </Box>
          <Box my={2}>
            <Box mb={1}>
              <Grid container justify="space-between" alignItems="center">
                <Label style={{ marginBottom: '0' }}>Password</Label>
                <Button color="primary" onClick={forgotPassword}>
                  <Typography variant="body1">Forgot Password?</Typography>
                </Button>
              </Grid>
            </Box>
            <PasswordInput
              name="password"
              variant="outlined"
              color="primary"
              placeholder="Password"
            />
          </Box>
          <Box my={2}>
            <PrimaryWallyButton
              style={{ padding: '1em 1.5em' }}
              type="submit"
              fullWidth
            >
              <Typography variant="h5" component="span">
                Log In
              </Typography>
            </PrimaryWallyButton>
          </Box>
        </Form>
      </Formik>
      <Box my={2}>
        <FBLogin />
      </Box>
      <PrimaryWallyButton
        style={{ padding: '1em 1.5em' }}
        variant="outlined"
        fullWidth
        onClick={showSignupForm}
      >
        <Typography variant="h5" component="span">
          Sign Up
        </Typography>
      </PrimaryWallyButton>
    </Box>
  );

  function login({ email, password }, { setSubmitting }) {
    user
      .login(email, password)
      .then(() => {
        let home = determineHome();
        routing.push(home);
      })
      .catch((error) => {
        const { response } = error;
        let msg = `Attempt to log in failed. Please contact ${support} for support.`;
        if (response && response.data && response.data.error) {
          msg = response.data.error.message;
        }
        snackbar.openSnackbar(msg, 'error');
      })
      .finally(() => {
        setSubmitting(false);
        modalV2.close();
      });
  }

  function determineHome() {
    const { isOps, isOpsLead, isAdmin, isRetail } = user;
    var home = '/main';

    if (isOps || isOpsLead) {
      home = '/pick-pack';
    } else if (isAdmin) {
      home = '/manage/retail';
    } else if (isRetail) {
      home = '/retail';
    }

    return home;
  }

  function forgotPassword() {
    logModalView('/forgot-password');
    modalV2.open(<ForgotPassword />);
  }

  function showSignupForm() {
    logModalView('/signup-zip');
    modalV2.open(<SignupForm />);
  }
}
