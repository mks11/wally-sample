import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Box, Typography } from '@material-ui/core';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from '../../styled-component-lib/Buttons';
import axios from 'axios';
import { API_ADDRESS_EDIT } from 'config';

export default function UpdateAddressForm({
  store: {
    user: userStore,
    modal: modalStore,
    loading: loadingStore,
    snackbar,
  },
  ...props
}) {
  const passedAddrId = modalStore.modalData;

  const {
    address_id,
    name,
    telephone,
    street_address,
    unit,
    city,
    state,
    zip,
    country,
    delivery_notes,
  } = userStore.getAddressById(passedAddrId) || {};

  const handleFormSubmit = (values, { setSubmitting }) => {
    loadingStore.toggle();
    axios
      .patch(API_ADDRESS_EDIT, values, userStore.getHeaderAuth())
      .then(() => {
        userStore.getUser();
        snackbar.openSnackbar(
          'Your address was updated successfully!',
          'success',
        );
      })
      .catch((err) => {
        snackbar.openSnackbar(
          'There was an error updating your address. Please contact info@thewallyshop.co for assistance.',
          'error',
        );
      })
      .finally(() => {
        setSubmitting(false);
        props.toggle(); // close the modal
        setTimeout(loadingStore.toggle(), 300);
      });
  };

  return (
    <Formik
      initialValues={{
        addressId: address_id,
        name,
        telephone,
        streetAddress: street_address,
        unit,
        city,
        state,
        zip,
        country,
        deliveryNotes: delivery_notes, //optional
      }}
      validationSchema={Yup.object({
        addressId: Yup.string().required('Address'),
        name: Yup.string().required("Name can't be blank"),
        telephone: Yup.string()
          .required("Telephone can't be blank")
          .min(10, 'Phone Number must be 10 characters')
          .max(10, 'Phone Number must be 10 characters'),
        streetAddress: Yup.string().required('An address must be provided'),
        city: Yup.string().required("City can't be blank"),
        state: Yup.string().required("State can't be blank"),
        zip: Yup.string().required("Zip can't be blank"),
        country: Yup.string().required("Country can't be blank"),
        deliveryNotes: Yup.string(),
        shippoAddressId: Yup.string(),
      })}
      enableReinitialize={true}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <TextInput
              name="name"
              placeholder="Enter your name"
              label="Name"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextInput
              name="telephone"
              placeholder="Enter your telephone"
              label="Telephone"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <FormikPlacesAutoComplete
              names={['city', 'zip', 'state', 'country', 'streetAddress']}
              mode={'edit'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name="streetAddress"
              label="Street Address"
              placeholder="Street Address"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="unit"
              label="Unit"
              placeholder="Apt number or company"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="city"
              label="City"
              placeholder="City"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="state"
              placeholder="State"
              label="State"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6}>
            <TextInput
              name="zip"
              label="Zip"
              placeholder="Zip"
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name="deliveryNotes"
              placeholder="Leave any notes for delivery... "
              type="text"
              multiline={true}
              rows={1}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Box margin={2}>
            <PrimaryWallyButton type="submit">
              <Typography variant="body1">Submit</Typography>
            </PrimaryWallyButton>
          </Box>
        </Grid>
      </Form>
    </Formik>
  );
}
