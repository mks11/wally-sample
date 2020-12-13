import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import { subscribeToNewsletter } from './../api/sendinblue';
import { TextInput } from './FormikComponents/NonRenderPropAPI';
import { useStores } from 'hooks/mobx';
import { ActivityButton } from 'styled-component-lib/Buttons';

export default function SubscribeToNewsletter() {
  const { modalV2 } = useStores();

  const handleOpenNewsletterForm = () => {
    modalV2.open(
      <>
        <Typography variant="h1" gutterBottom>
          Subscribe to our newsletter
        </Typography>
        <SubscribeToNewsletterForm />
      </>,
    );
  };

  return (
    <button
      style={{
        alignItems: 'center',
        display: 'flex',
        padding: '0.5rem',
        border: 'none',
        background: 'transparent',
        fontSize: '16px',
        color: '#263a52',
      }}
      onClick={handleOpenNewsletterForm}
    >
      <EmailIcon fontSize="large" style={{ color: '#263a52' }} />
      <span style={{ marginLeft: '4px' }}>Newsletter</span>
    </button>
  );
}

export function SubscribeToNewsletterForm() {
  const { modalV2, snackbar: snackbarStore } = useStores();
  const handleSubscribe = async (
    { email },
    { resetForm, setSubmitting, setFieldError },
  ) => {
    try {
      await subscribeToNewsletter(email);
      modalV2.close();
      snackbarStore.openSnackbar('Subscribed to newsletter!', 'success');
      resetForm();
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
            <Grid container spacing={1} alignItems="flex-start">
              <Grid item xs={12}>
                <TextInput
                  name="email"
                  type="email"
                  label="Subscribe"
                  placeholder="Enter your email address"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={8} sm={6}>
                <ActivityButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingTitle="Subscribing..."
                  loaderProps={{
                    size: 22,
                  }}
                  fullWidth
                  style={{ paddingTop: '12.5px', paddingBottom: '12.5px' }}
                >
                  submit
                </ActivityButton>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}
