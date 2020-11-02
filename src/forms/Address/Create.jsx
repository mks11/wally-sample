import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  FormikPlacesAutoComplete,
  // Checkbox,
} from 'common/FormikComponents/NonRenderPropAPI';
import { Grid, Box, Typography, FormControlLabel } from '@material-ui/core';
import { useStores } from 'hooks/mobx';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { API_ADDRESS_NEW } from 'config';
import usePost from 'hooks/usePost';
import { Checkbox } from 'common/FormikComponents/NonRenderPropAPI';

export default function AddressCreateForm() {
  const stores = useStores();
  const { modalV2 } = stores;

  const [submit, { data }] = usePost(
    API_ADDRESS_NEW,
    stores,
    'New address added successfully!',
    'There was an error in adding your address. Please contact info@thewallyshop.co for assistance.',
  );

  const handleFormSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values));
    // submit(values);
    // if (data) {
    //   setSubmitting(false);
    //   modalV2.close(); //todo check if it is still needed
    // }
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
        country: '',
        deliveryNotes: '',
        isPreferredAddress: false,
      }}
      validationSchema={Yup.object({
        name: Yup.string().required("Name can't be blank"),
        telephone: Yup.string()
          .required("Telephone can't be blank")
          .min(10, 'Phone Number must be 10 characters')
          .max(10, 'Phone Number must be 10 characters'),
        streetAddress: Yup.string().required('An address must be provided'),
        unit: Yup.string(),
        city: Yup.string().required("City can't be blank"),
        state: Yup.string().required("State can't be blank"),
        zip: Yup.string().required("Zip can't be blank"),
        country: Yup.string().required("Country can't be blank"),
        deliveryNotes: Yup.string(),
        isPreferredAddress: Yup.bool(),
      })}
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
            <TextInput
              name="deliveryNotes"
              label="Delivery Notes"
              placeholder="Leave any notes for delivery... "
              type="text"
              multiline={true}
              rows={1}
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
