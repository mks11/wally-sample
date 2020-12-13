import React from 'react';

// API
import { createAddress } from 'api/address';

// Forms
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import 'yup-phone';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { Checkbox } from 'common/FormikComponents/NonRenderPropAPI';
import PhoneInput from 'common/FormikComponents/NonRenderPropAPI/PhoneInput';

// Material UI
import { Box, Grid, Typography } from '@material-ui/core';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// Styled Components
import { ActivityButton } from 'styled-component-lib/Buttons';

function AddressCreateForm({ onCreate }) {
  const stores = useStores();
  const {
    modalV2: modalV2Store,
    snackbar: snackbarStore,
    user: userStore,
  } = stores;
  const { user } = userStore;
  const handleSubmit = async (values, { setFieldError, setSubmitting }) => {
    try {
      const auth = userStore.getHeaderAuth();
      let res = await createAddress(values, auth);
      if (res && res.data) {
        const { address } = res.data;
        await userStore.getUser();
        onCreate && onCreate(address._id);
        setSubmitting(false);
        modalV2Store.close();
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
      setSubmitting(false);
    }
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Add New Address
      </Typography>
      <Formik
        initialValues={{
          name: user ? user.name : '',
          telephone: user ? user.primary_telephone : '',
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
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <TextInput
                  name="name"
                  placeholder="Enter your name"
                  label="Name"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={8} md={6}>
                <TextInput
                  name="streetAddress"
                  label="Street Address"
                  placeholder="Street Address"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4} sm={6}>
                <TextInput
                  name="unit"
                  label="Unit"
                  placeholder="Apt number or company"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  name="city"
                  label="City"
                  placeholder="City"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
                <TextInput
                  name="state"
                  placeholder="State"
                  label="State"
                  fullWidth={true}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6} sm={6} md={3}>
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
                  <ActivityButton
                    disabled={isSubmitting ? true : false}
                    fullWidth
                    isLoading={isSubmitting}
                    loadingTitle={'Loading...'}
                    type="submit"
                  >
                    Submit
                  </ActivityButton>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default observer(AddressCreateForm);
