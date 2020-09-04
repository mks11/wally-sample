import React from 'react';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  MultiSelect,
} from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from './../../styled-component-lib/Buttons';
import { Box, Grid } from '@material-ui/core';

export default function ReportIssueForm({
  store: {
    user: userStore,
    order: orderStore,
    loading: loadingStore,
    modal: modalStore,
  },
  orderId,
  toggle,
}) {
  const IssueTypes = [
    'Damaged Order',
    'Packaging Deposit',
    'Incorrect Items',
    'Lost Shipment',
  ];

  return (
    <Formik
      initialValues={{
        orderId,
        description: '',
        tags: [],
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().required('Issue can not be empty'),
        tags: Yup.array(Yup.mixed().oneOf([...IssueTypes])),
      })}
      onSubmit={({ orderId, description, tags }, { setSubmitting }) => {
        loadingStore.toggle();
        orderStore
          .submitIssue(
            {
              orderId,
              description,
              tags,
            },
            userStore.getHeaderAuth(),
          )
          .then((data) => {
            //
            toggle(); // close the modal .. issue: modalStore.toggleModal() doesn't actually close the modal
          })
          .catch((e) => {
            // TODO add snackbarStore to this branch
          })
          .finally(() => {
            loadingStore.toggle();
            setSubmitting(false);
          });
      }}
    >
      <Form>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Box marginY={2}>
              <TextInput
                name="description"
                label={'Describe'}
                type={'text'}
                placeholder={'Describe the issue ...'}
                fullWidth={true}
                multiline={true}
                rows={2}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box marginY={2}>
              <MultiSelect name="tags" label="Issue Type" values={IssueTypes} />
            </Box>
          </Grid>
          <PrimaryWallyButton type="submit"> Submit Report </PrimaryWallyButton>
        </Grid>
      </Form>
    </Formik>
  );
}
