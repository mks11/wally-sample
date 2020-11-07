import React, { useState, useEffect } from 'react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
  TextInput,
  FormikPlacesAutoComplete,
} from 'common/FormikComponents/NonRenderPropAPI';
import { Grid, Typography } from '@material-ui/core';
import { useStores } from 'hooks/mobx';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Checkbox } from 'common/FormikComponents/NonRenderPropAPI';
import { createAddress } from 'api/user';

export default function AddressCreateForm({ allowDelivery }) {
  const [createdAddr, setCreatedAddr] = useState();
  const stores = useStores();
  const {
    modalV2: modalV2Store,
    snackbar: snackbarStore,
    user: userStore,
  } = stores;

  const setAddress = (data) => {
    //TODO verify if the created address is always the last one
    // there is also a comparer function in store that could be refactored to use here
    if (data.addresses) {
      const n = data.addresses.length;
      if (n > 0) {
        //userStore.setDeliveryAddress(data.addresses[n - 1]);
        setCreatedAddr(data.addresses[n - 1]);
      }
    }
  };

  const handleFormSubmit = async (values, { setFieldError, setSubmitting }) => {
    try {
      const auth = userStore.getHeaderAuth();
      let { data } = await createAddress(values, auth);
      if (data) {
        setSubmitting(false);
        setAddress(data);
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
          .matches(/^\d{10}$/, 'Telephone must be 10 digits.')
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
          <Typography variant="h1" gutterBottom align="center">
            Add New Address
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
        <Grid spacing={1} container>
          <Grid item xs={12} sm={allowDelivery ? 6 : 12}>
            <PrimaryWallyButton
              type="submit"
              variant={allowDelivery ? 'outlined' : 'contained'}
              fullWidth
            >
              Add Address
            </PrimaryWallyButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            {allowDelivery && <AllowDeliveryButton createdAddr={createdAddr} />}
          </Grid>
        </Grid>
      </Form>
    </Formik>
  );
}

// needed to create this as a separate component to access the formikContext (to access submitForm)
function AllowDeliveryButton({ createdAddr }) {
  // state that makes sure the effect (that sets deliveryAddress effect in store)
  // is only run when it is clicked and not just on mount
  const [clicked, setClicked] = useState(false);

  const { user: userStore } = useStores();
  const { submitForm } = useFormikContext();

  const handleAddAndDeliver = async () => {
    setClicked(true);
    await submitForm();
  };

  useEffect(() => {
    if (createdAddr && clicked) {
      userStore.setDeliveryAddress(createdAddr);
      setClicked(false);
    }
  }, [createdAddr, clicked]);

  return (
    <PrimaryWallyButton onClick={handleAddAndDeliver} fullWidth>
      Deliver to this address
    </PrimaryWallyButton>
  );
}
