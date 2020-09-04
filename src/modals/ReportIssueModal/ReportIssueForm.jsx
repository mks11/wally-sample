import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  MultiSelect,
} from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from './../../styled-component-lib/Buttons';
import { Grid, Typography } from '@material-ui/core';

const IssueTypes = [
  'Damaged Order',
  'Incorrect Items',
  'Lost Shipment',
  'Missing Items',
  'Packaging Deposit',
];

export default function ReportIssueForm({
  store: {
    user: userStore,
    order: orderStore,
    loading: loadingStore,
    snackbar: snackbarStore,
  },
  orderId,
  packagingReturnId,
  toggle,
}) {
  return (
    <Formik
      initialValues={{
        orderId,
        packagingReturnId,
        description: '',
        tags: [],
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().required('Issue can not be empty'),
        tags: Yup.array(Yup.mixed().oneOf([...IssueTypes])),
      })}
      onSubmit={({ orderId, description, tags }, actions) => {
        loadingStore.toggle();
        orderStore
          .submitIssue(
            {
              orderId,
              description,
              packagingReturnId,
              tags,
            },
            userStore.getHeaderAuth(),
          )
          .then((res) => {
            snackbarStore.openSnackbar(
              "We've received your issue and will get back to you as soon as possible with a solution!",
              'success',
            );
          })
          .catch((e) => {
            snackbarStore.openSnackbar(
              'Oops, an error occured while submitting your issue! Please contact us at info@thewallyshop.co for support with this issue.',
              'error',
            );
          })
          .finally(() => {
            actions.setSubmitting(false);
            toggle();
            setTimeout(loadingStore.toggle(), 300);
          });
      }}
    >
      <Form style={{ width: '100%' }}>
        <Grid container justify="center" spacing={2}>
          <Grid item xs={12}>
            <TextInput
              name="description"
              label={'Describe your issue'}
              type={'text'}
              fullWidth
              multiline
            />
          </Grid>
          <Grid item xs={12}>
            <MultiSelect name="tags" label="Issue Type" values={IssueTypes} />
          </Grid>
          <br></br>
          <Grid item xs={8}>
            <PrimaryWallyButton type="submit" fullWidth>
              <Typography variant="body1">Submit Report</Typography>
            </PrimaryWallyButton>
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
}
