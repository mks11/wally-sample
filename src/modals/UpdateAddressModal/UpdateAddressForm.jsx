import React from 'react';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import FormikPlacesAutocomplete from './FormikPlacesAutoComplete';
import { Grid, TextField, FormHelperText, Box } from '@material-ui/core';
import { props } from 'bluebird';
import { Container } from 'reactstrap';
import FormikTextInput from 'common/FormikTextInput';
import { PrimaryWallyButton } from './../../styled-component-lib/Buttons';

function Input({ label, ...props }) {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <TextField
        // className="aw-input--control aw-input--control-large aw-input--left"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <FormHelperText error>{meta.error}</FormHelperText>
      ) : null}
    </>
  );
}

export default function UpdateAddressForm() {
  const handleAddressChange = () => {
    //
  };

  const handleAddressSelect = () => {
    //
  };

  // const validateUnitField = (value) => {
  //   return value.length > 0;
  // };

  const handleFormSubmit = (values, { setSubmitting }) => {
    alert(JSON.stringify(values));
  };

  return (
    <Formik
      initialValues={{
        addressId: '',
        name: '',
        telephone: '',
        streetAddress: '',
        unit: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        deliveryNotes: '', //optional
        shippoAddressId: '', //optional
      }}
      validationSchema={Yup.object({
        addressId: Yup.string().required('Required'),
        name: Yup.string().required('Required'),
        telephone: Yup.string().required('Required'),
        streetAddress: Yup.string().required('Required'),
        unit: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        zip: Yup.string().required('Required'),
        country: Yup.string().required('Required'),
        deliveryNotes: Yup.string(),
        shippoAddressId: Yup.string(),
      })}
      onSubmit={handleFormSubmit}
    >
      <Form>
        <FormikPlacesAutocomplete name={'address'} mode={'edit'} />
        <Grid container spacing={2} justify="center">
          <Grid container item xs={12} spacing={2} justify="space-evenly">
            <Grid item xs={6}>
              <Input
                name="unit"
                type="text"
                placeholder="Apt number or company"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                name="zip"
                type="text"
                placeholder="Zip"
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <Grid
            container
            item
            xs={12}
            spacing={2}
            justify="space-evenly"
            margin={1}
          >
            <Grid item xs={12} sm={6}>
              <Input
                name="name"
                type="text"
                placeholder="Enter your name"
                fullWidth={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                name="telephone"
                type="text"
                placeholder="Enter your telephone"
                fullWidth={true}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Input
              name="deliveryNotes"
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
