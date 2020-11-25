import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Typography, Grid, Box, Container } from '@material-ui/core';
import { subscribeToNewsletter } from './../api/sendinblue';
import { TextInput } from './FormikComponents/NonRenderPropAPI';
import { useStores } from 'hooks/mobx';
import { ActivityButton } from 'styled-component-lib/Buttons';

export default function SubscribeToNewsletter() {
  const { snackbar: snackbarStore } = useStores();

  const handleSubscribe = async (
    { email },
    { setSubmitting, setFieldError },
  ) => {
    try {
      const res = await subscribeToNewsletter(email);
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
                <Grid item xs={4} style={{ marginTop: '0.8rem' }}>
                  <ActivityButton
                    type="submit"
                    isLoading={isSubmitting}
                    loaderProps={{
                      size: 22,
                    }}
                  >
                    <Typography style={{ padding: '0 1.2rem' }}>
                      Subscribe
                    </Typography>
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
