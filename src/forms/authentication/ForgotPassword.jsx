import React, { useState } from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Form, Formik } from 'formik';
import { Box, Typography } from '@material-ui/core';

// CustomComponents
import { TextInput } from 'common/FormikComponents/NonRenderPropAPI';

// Styled Components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

import * as Yup from 'yup';

export default function LoginForm() {
  const [emailError, setEmailError] = useState('');
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
            errorMsg={emailError}
            setErrorMsg={setEmailError}
          />
        </Box>
        <Box my={2}>
          <PrimaryWallyButton type="submit">
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
      .then(() => {
        setSubmitting(false);
        modalV2.close();
        snackbar.openSnackbar(
          `Instructions to reset your password have been sent to ${email}.`,
        );
      })
      .catch((error) => {
        setSubmitting(false);
        const { response } = error;
        if (response && response.data && response.data.error) {
          const { name, message } = response.data.error;
          if (name === 'NotFoundError') {
            setEmailError(message);
          }
        }
      });
  }
}
