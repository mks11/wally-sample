import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Grid, Box, Typography, Container } from '@material-ui/core';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { useStores } from 'hooks/mobx';
import { ActivityButton } from 'styled-component-lib/Buttons';
import PhoneInput from 'common/FormikComponents/NonRenderPropAPI/PhoneInput';
import 'yup-phone';

// Utilities
import { getErrorMessage, getErrorParam, santizePhoneNum } from 'utils';

export default function UpdateAddressForm({ addressId, ...props }) {
  const { modalV2: modalV2Store, user: userStore, snackbar } = useStores();

  const {
    _id,
    name,
    telephone,
    street_address,
    unit,
    city,
    state,
    zip,
    country,
  } = userStore.getAddressById(addressId) || {};

  var sanitizedTelephone = telephone ? santizePhoneNum(telephone) : '';

  const handleFormSubmit = async (values, { setFieldError, setSubmitting }) => {
    try {
      await userStore.updateAddress(values);
      snackbar.openSnackbar('Address updated successfully!', 'success');
      setSubmitting(false);
      modalV2Store.close();
    } catch (error) {
      const msg = getErrorMessage(error);
      const param = getErrorParam(error);

      if (msg && param) {
        setFieldError(param, msg);
      } else if (msg) {
        snackbar.openSnackbar(msg, 'error');
      } else {
        snackbar.openSnackbar('Failed to update address.', 'error');
      }

      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1" gutterBottom>
        Edit Address
      </Typography>
      <Box>
        <Formik
          initialValues={{
            _id,
            name,
            telephone: sanitizedTelephone,
            streetAddress: street_address,
            unit,
            city,
            state,
            zip,
            country,
          }}
          validationSchema={Yup.object({
            _id: Yup.string().required("Address object id can't be blank"),
            name: Yup.string().required("Name can't be blank"),
            telephone: Yup.string().phone(
              'US',
              false,
              'Telephone must be a valid US phone number',
            ),
            streetAddress: Yup.string().required('An address must be provided'),
            city: Yup.string().required("City can't be blank"),
            state: Yup.string().required("State can't be blank"),
            zip: Yup.string()
              .required("Zip can't be blank")
              .min(5, 'Zip must be 5 digits'),
            country: Yup.string().required("Country can't be blank"),
            shippoAddressId: Yup.string(),
          })}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name="name"
                    placeholder="Enter your name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name="streetAddress"
                    label="Street Address"
                    placeholder="Street Address"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name="unit"
                    label="Unit"
                    placeholder="Apt number or company"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput
                    name="city"
                    label="City"
                    placeholder="City"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextInput
                    name="state"
                    placeholder="State"
                    label="State"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextInput
                    name="zip"
                    label="Zip"
                    placeholder="Zip"
                    variant="outlined"
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
