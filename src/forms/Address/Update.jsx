import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Box, Typography, Container } from '@material-ui/core';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { useStores } from 'hooks/mobx';
import axios from 'axios';
import { API_ADDRESS_EDIT } from 'config';
import { ActivityButton } from 'styled-component-lib/Buttons';
import PhoneInput from 'common/FormikComponents/NonRenderPropAPI/PhoneInput';
import 'yup-phone';
import { santizePhoneNum } from 'utils';

export default function UpdateAddressForm({ addressId, ...props }) {
  const { user: userStore, snackbar } = useStores();

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
  } = userStore.getAddressById(addressId) || {};

  var sanitizedTelephone = telephone ? santizePhoneNum(telephone) : '';

  const handleFormSubmit = (values, { setSubmitting }) => {
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
      });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1"> Edit Address </Typography>
      <Box>
        <Formik
          initialValues={{
            addressId: address_id,
            name,
            telephone: sanitizedTelephone,
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
            telephone: Yup.string().phone(
              'US',
              false,
              'Telephone must be a valid US phone number',
            ),
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
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <TextInput
                    name="name"
                    placeholder="Enter your name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <PhoneInput
                    name="telephone"
                    placeholder="Enter your telephone"
                    label="Telephone"
                    variant="outlined"
                    fullWidth
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
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextInput
                    name="unit"
                    label="Unit"
                    placeholder="Apt number or company"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextInput
                    name="city"
                    label="City"
                    placeholder="City"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextInput
                    name="state"
                    placeholder="State"
                    label="State"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextInput
                    name="zip"
                    label="Zip"
                    placeholder="Zip"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    name="deliveryNotes"
                    placeholder="Leave any notes for delivery... "
                    type="text"
                    multiline
                    variant="outlined"
                    rows={1}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Box margin={2}>
                  <ActivityButton
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    <Typography variant="body1">Submit</Typography>
                  </ActivityButton>
                </Box>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
