import React from 'react';

// Axios
import axios from 'axios';

// Config
import { BASE_URL } from 'config';

// CustomComponents
import { TextInput } from 'common/FormikComponents/NonRenderPropAPI';
import { ActivityButton } from 'styled-component-lib/Buttons';

// Formik
import { Formik, Form } from 'formik';

// Material UI
import { Container, Grid, Typography } from '@material-ui/core';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Yup
import * as Yup from 'yup';

function PackagingDepositRefund() {
  const { snackbar: snackbarStore, user: userStore } = useStores();

  async function handleSubmit(values, { resetForm, setSubmitting }) {
    try {
      const auth = userStore.getHeaderAuth();
      const url = '/refund-packaging-deposit-ticket';
      await axios.post(url, values, {
        baseURL: BASE_URL,
        ...auth,
      });
      resetForm();
      snackbarStore.openSnackbar(
        'Packaging balance refund request submitted successfully!',
        'success',
      );
    } catch (error) {
      console.log(error);
      snackbarStore.openSnackbar(
        'Failed to submit packaging balance refund request.',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container
      maxWidth="md"
      style={{ marginBottom: '1rem', marginTop: '1rem' }}
    >
      <Formik
        enableReinitialize
        initialValues={{ email: '', name: '' }}
        onSubmit={handleSubmit}
        validationSchema={Yup.object({
          email: Yup.string()
            .required('Email address is required')
            .email('Invalid email address'),
          name: Yup.string().required('Name is required'),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <Typography variant="h3" component="h1" gutterBottom>
              Redeem Packaging Balance
            </Typography>
            <Typography gutterBottom>
              To request a refund of your packaging balance, please fill out the
              form below, making sure to give us the email address you used to
              create your account as well as your name for correspondence
              purposes.
            </Typography>
            <Typography gutterBottom>
              Refund requests will be processed in 5 - 10 days. If there's an
              issue with your request we'll reach out to you for more
              information.
            </Typography>
            <br />
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextInput
                  color="primary"
                  disabled={isSubmitting}
                  name="name"
                  placeholder="Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  color="primary"
                  disabled={isSubmitting}
                  name="email"
                  placeholder="Email Address"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <ActivityButton
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  fullWidth
                  type="submit"
                >
                  Submit
                </ActivityButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}

export default observer(PackagingDepositRefund);
