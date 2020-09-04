import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, FormHelperText, Box } from '@material-ui/core';
import { props } from 'bluebird';
import { Container } from 'reactstrap';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { PrimaryWallyButton } from '../../styled-component-lib/Buttons';
import axios from 'axios';
import { API_ADDRESS_EDIT } from 'config';

export default function UpdateAddressForm({
  store: { user: userStore, modal: modalStore, loading: loadingStore },
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
    shippoAddressId,
  } = userStore.getAddressById(passedAddrId) || {};

  const handleFormSubmit = (values, { setSubmitting }) => {
    try {
      loadingStore.toggle();
      axios.patch(API_ADDRESS_EDIT, userStore.getHeaderAuth());
    } catch (e) {
      //todo handle with snackbar
    } finally {
      loadingStore.toggle();
      toggle(); // close the modal
    }
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
        shippoAddressId, //optional
      }}
      validationSchema={Yup.object({
        addressId: Yup.string().required('Address'),
        name: Yup.string().required("Name can't be blank"),
        telephone: Yup.string().required("Telephone can't be blank"),
        streetAddress: Yup.string().required('An address must be provided'),
        unit: Yup.string().required("Unit can't be blank"),
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
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <FormikPlacesAutoComplete
              names={['city', 'zip', 'state', 'country', 'streetAddress']}
              mode={'edit'}
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
              name="zip"
              label="Zip"
              placeholder="Zip"
              fullWidth={true}
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
            <PrimaryWallyButton type="submit">Submit</PrimaryWallyButton>
          </Box>
        </Grid>
      </Form>
    </Formik>
  );
}
