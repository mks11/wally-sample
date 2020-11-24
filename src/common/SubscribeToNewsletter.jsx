import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  InputAdornment,
  Typography,
  Grid,
  Box,
  Container,
} from '@material-ui/core';
import { PrimaryWallyButton } from './../styled-component-lib/Buttons';
import { subscribeToNewsletter } from './../api/sendinblue';
import { TextInput } from './FormikComponents/NonRenderPropAPI';
import { useStores } from 'hooks/mobx';
import { AccountCircle, DonutLargeOutlined } from '@material-ui/icons';
import { ActivityButton } from 'styled-component-lib/Buttons';

export default function SubscribeToNewsletter() {
  const [email, setEmail] = useState('');
  const { snackbar: snackbarStore } = useStores();

  const handleSubscribe = async (
    { email },
    { setSubmitting, setFieldError },
  ) => {
    try {
      await subscribeToNewsletter(email);
      snackbarStore.openSnackbar(
        'Successfully subscribed to newsletter!',
        'success',
      );
    } catch (e) {
      if (e && e.response && e.response.data && e.response.data.error) {
        setFieldError('email', e.response.data.error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={Yup.object({
        email: Yup.string()
          .required("Email address can't be blank.")
          .email('Invalid email address.'),
      })}
      onSubmit={handleSubscribe}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <Container maxWidth="sm">
              <Grid container spacing={1} alignItems="flex-start">
                <Grid item xs={8}>
                  <TextInput
                    name="email"
                    type="email"
                    label="Subscribe to our newsletter"
                    placeholder="Enter your email"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  {/* <PrimaryWallyButton type="submit">
                    Subscribe
                  </PrimaryWallyButton> */}
                  <ActivityButton type="submit" isLoading>
                    Subscribe
                  </ActivityButton>
                </Grid>
              </Grid>
            </Container>
          </Form>
        );
      }}
    </Formik>
  );
}

{
  /* <Form>
            <Box
              //   container
              //   spacing={1}
              alignItems="center"
              style={{ minWidth: '160px', border: '1px solid blue' }}
              display="flex"
            >
              <Box flexGrow={1}>
                <TextInput
                  name="email"
                  type="email"
                  label="Subscribe to our newsletter"
                  placeholder="Enter your email"
                  //   variant="outlined"
                />
              </Box>
              <Box flexShrink={1}>
                <PrimaryWallyButton type="submit">Subscribe</PrimaryWallyButton>
              </Box>
            </Box>
          </Form> */
}
