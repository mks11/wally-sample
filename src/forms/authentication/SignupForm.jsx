import React from 'react';

// Config
import { support } from 'config';
import { logModalView } from 'services/google-analytics';
import { logEvent } from 'services/google-analytics';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Typography } from '@material-ui/core';

// CustomComponents
import {
  TextInput,
  PasswordInput,
} from 'common/FormikComponents/NonRenderPropAPI';
import FBLogin from 'common/FBLogin';
import LoginForm from 'forms/authentication/LoginForm';

// Styled Components
import { Label } from 'styled-component-lib/InputLabel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { InternalWallyLink } from 'styled-component-lib/Links';

import * as Yup from 'yup';

export default function SignupForm() {
  const { checkout, modal, modalV2, routing, snackbar, user } = useStores();

  return (
    <Box>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required("Name can't be blank."),
          email: Yup.string()
            .required("Email address can't be blank.")
            .email('Invalid email address.'),
          password: Yup.string().required("Password can't be blank."),
        })}
        enableReinitialize={true}
        onSubmit={signup}
      >
        <Form>
          <Typography variant="h1" gutterBottom>
            Sign Up
          </Typography>
          <Box my={2}>
            <Label>Name</Label>
            <TextInput
              name="name"
              variant="outlined"
              color="primary"
              placeholder="Full name."
            />
          </Box>
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
            <Label>Password</Label>
            <PasswordInput
              name="password"
              variant="outlined"
              color="primary"
              placeholder="Password"
            />
          </Box>
          <Box my={2}>
            <Typography variant="body1" gutterBottom>
              By signing up, you agree to our{' '}
              <InternalWallyLink
                target="_blank"
                rel="noopener noreferrer"
                to={'/tnc'}
              >
                <i>Terms of Service</i>
              </InternalWallyLink>{' '}
              &nbsp;and &nbsp;
              <InternalWallyLink
                target="_blank"
                rel="noopener noreferrer"
                to={'/privacy'}
              >
                <i>Privacy Policy.</i>
              </InternalWallyLink>
            </Typography>
          </Box>
          <Box my={2}>
            <PrimaryWallyButton
              style={{ padding: '1em 1.5em' }}
              type="submit"
              fullWidth
            >
              <Typography variant="h5" component="span">
                Sign Up
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
        onClick={showLoginForm}
      >
        <Typography variant="h5" component="span">
          Log In
        </Typography>
      </PrimaryWallyButton>
    </Box>
  );

  function signup({ name, email, password }, { setSubmitting }) {
    logEvent({ category: 'Signup', action: 'SubmitInfo' });
    user
      .signup({ name, email, password })
      .then(() => {
        checkout.getCurrentCart(user.getHeaderAuth(), user.getDeliveryParams());
        modal.toggleModal('welcome');
        routing.push('/main');
      })
      .catch(() =>
        snackbar.openSnackbar(
          `Attempt to sign up failed. Please contact ${support} for support.`,
          'error',
        ),
      )
      .finally(() => {
        setSubmitting(false);
        modalV2.close();
      });
  }

  function showLoginForm() {
    logModalView('/login');
    modalV2.open(<LoginForm />);
  }
}
