import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  FormikPlacesAutoComplete,
  // Checkbox,
} from 'common/FormikComponents/NonRenderPropAPI';
import { Grid, Box, FormControlLabel, Typography } from '@material-ui/core';
import { useStores } from 'hooks/mobx';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
// import { API_ADDRESS_NEW } from 'config';
// import usePost from 'hooks/usePost';
import { Checkbox } from 'common/FormikComponents/NonRenderPropAPI';
import { createAddress } from 'api/user';

export default function AddressCreateForm() {
  const stores = useStores();
  const {
    modalV2: modalV2Store,
    snackbar: snackbarStore,
    user: userStore,
  } = stores;

  // const [submit, { data }] = usePost(
  //   API_ADDRESS_NEW,
  //   stores,
  //   'New address added successfully!',
  //   'There was an error in adding your address. Please contact info@thewallyshop.co for assistance.',
  // );

  const handleFormSubmit = async (values, { setFieldError, setSubmitting }) => {
    try {
      const auth = userStore.getHeaderAuth();
      let { data } = await createAddress(values, auth);
      if (data) {
        setSubmitting(false);
        modalV2Store.close();
        snackbarStore.openSnackbar('Address created successfully!', 'success');
        userStore.getUser();
      }
    } catch ({ response: { data } }) {
      if (data && data.error && data.error.message && data.error.param) {
        const { message, param } = data.error;
        setFieldError(param, message);
      } else {
        snackbarStore.openSnackbar('Failed to create new address.', 'error');
      }
    }
  };

  return (
    <Formik
      initialValues={{
        name: '',
        telephone: '',
        streetAddress: '',
        unit: '',
        city: '',
        state: '',
        zip: '',
        isPreferredAddress: false,
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name can't be blank"),
        telephone: Yup.string()
          .matches(
            /^[0-9]{10}$/,
            'Telephone must be 10 digit (currently supported format - xxxxxxxxxx).',
          )
          .required("Telephone can't be blank"),
        streetAddress: Yup.string().required('An address must be provided'),
        unit: Yup.string(),
        city: Yup.string().required("City can't be blank"),
        state: Yup.string().required("State can't be blank"),
        zip: Yup.string().required("Zip can't be blank"),
        isPreferredAddress: Yup.bool(),
      })}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <Grid container spacing={3}>
          <Typography variant="h1" gutterBottom>
            Add new address
          </Typography>
          <Grid item xs={12} sm={12}>
            <TextInput
              name="name"
              placeholder="Enter your name"
              label="Name"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextInput
              name="telephone"
              placeholder="Enter your telephone"
              label="Telephone"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <FormikPlacesAutoComplete
              names={['city', 'zip', 'state', 'streetAddress']}
              mode={'edit'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name="streetAddress"
              label="Street Address"
              placeholder="Street Address"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="unit"
              label="Unit"
              placeholder="Apt number or company"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="city"
              label="City"
              placeholder="City"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="state"
              placeholder="State"
              label="State"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="zip"
              label="Zip"
              placeholder="Zip"
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Checkbox
              name="isPreferredAddress"
              label="Set as my preferred address"
              color="primary"
            />
          </Grid>
        </Grid>
        <Box margin={2}>
          <PrimaryWallyButton type="submit" fullWidth>
            Submit
          </PrimaryWallyButton>
        </Box>
      </Form>
    </Formik>
  );
}
