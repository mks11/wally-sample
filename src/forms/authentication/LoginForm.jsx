import React, { useState } from 'react';

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
import {
  PrimaryWallyButton,
  ActivityButton,
} from 'styled-component-lib/Buttons';

import * as Yup from 'yup';

// Forms
import ForgotPassword from 'forms/authentication/ForgotPassword';
import SignupForm from 'forms/authentication/SignupForm';

export default function LoginForm() {
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { modalV2, routing, user } = useStores();

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
        {({ isSubmitting }) => (
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
                errorMsg={emailError}
                setErrorMsg={setEmailError}
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
                errorMsg={passwordError}
                setErrorMsg={setPasswordError}
              />
            </Box>
            <Box my={2}>
              <ActivityButton
                type="submit"
                isLoading={isSubmitting}
                loadingTitle={'Logging in...'}
                fullWidth
              >
                Log In
              </ActivityButton>
            </Box>
          </Form>
        )}
      </Formik>
      <Box my={2}>
        <FBLogin />
      </Box>
      <PrimaryWallyButton variant="outlined" fullWidth onClick={showSignupForm}>
        Sign Up
      </PrimaryWallyButton>
    </Box>
  );

  function login({ email, password }, { setSubmitting }) {
    user
      .login(email, password)
      .then(() => {
        setSubmitting(false);
        let home = determineHome();
        modalV2.close();
        routing.push(home);
      })
      .catch((error) => {
        setSubmitting(false);
        const { response } = error;
        if (response && response.data && response.data.error) {
          const { name, message } = response.data.error;
          if (name === 'NotFoundError') {
            setEmailError(message);
          } else {
            setPasswordError(message);
          }
        } else {
          setPasswordError(
            `Attempt to log in failed. Please contact ${support} for support.`,
          );
        }
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
