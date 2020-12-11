import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import 'yup-phone';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { Box, Grid, Typography } from '@material-ui/core';
import { useStores } from 'hooks/mobx';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Checkbox } from 'common/FormikComponents/NonRenderPropAPI';
import { createAddress } from 'api/address';
import PhoneInput from 'common/FormikComponents/NonRenderPropAPI/PhoneInput';

export default function AddressCreateForm({ onCreate }) {
  const stores = useStores();
  const {
    modalV2: modalV2Store,
    snackbar: snackbarStore,
    user: userStore,
  } = stores;

  const handleSubmit = async (values, setFieldError) => {
    try {
      const auth = userStore.getHeaderAuth();
      let res = await createAddress(values, auth);
      if (res && res.data) {
        const { address } = res.data;
        await userStore.getUser();
        modalV2Store.close();
        onCreate && onCreate(address._id);
        snackbarStore.openSnackbar('Address created successfully!', 'success');
      }
    } catch ({ response }) {
      const { data } = response;
      if (data && data.error && data.error.message && data.error.param) {
        const { message, param } = data.error;
        setFieldError(param, message);
      } else {
        snackbarStore.openSnackbar('Failed to create new address.', 'error');
      }
    }
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Add New Address
      </Typography>
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
            .phone('US', false, 'Telephone must be a valid US phone number')
            .matches(/^\d{10}$/, 'Telephone must be 10 digits.')
            .required("Telephone can't be blank"),
          streetAddress: Yup.string().required('An address must be provided'),
          unit: Yup.string(),
          city: Yup.string().required("City can't be blank"),
          state: Yup.string().required("State can't be blank"),
          zip: Yup.string().required("Zip can't be blank"),
          isPreferredAddress: Yup.bool(),
        })}
        onSubmit={(values, { setFieldError, setSubmitting }) => {
          handleSubmit(values, setFieldError);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextInput
                  name="name"
                  placeholder="Enter your name"
                  label="Name"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <PhoneInput
                  name="telephone"
                  placeholder="Enter your telephone"
                  variant="outlined"
                  fullWidth
                  label="Telephone"
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
              <Grid item xs={12} sm={6}>
                <TextInput
                  name="unit"
                  label="Unit"
                  placeholder="Apt number or company"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  name="city"
                  label="City"
                  placeholder="City"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  name="state"
                  placeholder="State"
                  label="State"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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
            <Grid container justify="center">
              <Grid item>
                <Box py={2}>
                  <PrimaryWallyButton
                    type="submit"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Add New Address
                  </PrimaryWallyButton>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
