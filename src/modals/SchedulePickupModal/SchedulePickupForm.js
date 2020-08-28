// Node Modules
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// API
import { API_SCHEDULE_PICKUP } from "config";

// Components
import { ErrorMessage, Formik, Form, Field } from "formik";
import { Button, Grid, Typography } from "@material-ui/core";
import FormikDateSelect from "common/FormikDateSelect";
import FormikTimeSelect from "common/FormikTimeSelect";
import FormikAddressSelect from "common/FormikAddressSelect";
import FormikTextInput from "common/FormikTextInput";

export default function SchedulePickupForm({
  userStore,
  loadingStore,
  modalStore,
}) {
  const earliestTime = moment({ hour: 9 }).add(1, "d").toDate();
  const latestTime = moment({ hour: 17 }).add(1, "d").toDate();

  return (
    <Formik
      initialValues={{
        addressId: "",
        scheduledDate: "",
        earliestTime: "",
        latestTime: "",
        deliveryInstructions: "",
      }}
      validate={validate}
      onSubmit={(values) => {
        console.log(values);
        // const {
        //     selectedAddressId,
        //     latestTime,
        //     earliestTime,
        //     pickupDate,
        //     invalidLatestTime,
        //   } = this.state;
        //   return axios.post(
        //     API_SCHEDULE_PICKUP,
        //     {
        //       address_id,
        //       scheduled_date,
        //       earliest_time,
        //       latest_time,
        //       pickup_notes,
        //     },
        //     this.userStore.getHeaderAuth()
        //   );
      }}
    >
      {({ errors, isSubmitting, setFieldValue, touched, validateField }) => (
        <Form>
          <Grid container justify="center" spacing={4}>
            <Typography variant="h1" gutterBottom>
              Schedule Pickup
            </Typography>
            <Grid item xs={12}>
              <Field
                name="scheduledDate"
                component={FormikDateSelect}
                handleSelectDate={setFieldValue}
                touched={touched.scheduledDate}
                error={errors.scheduledDate}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Field
                name="earliestTime"
                component={FormikTimeSelect}
                handleSelectTime={setFieldValue}
                labelId="earliest-pickup-time"
                label="Earliest Pickup Time"
                earliestTime={earliestTime}
                latestTime={latestTime}
                interval={60}
                touched={touched.earliestTime}
                error={errors.earliestTime}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Field
                name="latestTime"
                component={FormikTimeSelect}
                handleSelectTime={setFieldValue}
                labelId="latest-pickup-time"
                label="Latest Pickup Time"
                earliestTime={earliestTime}
                latestTime={latestTime}
                interval={60}
                touched={touched.latestTime}
                error={errors.latestTime}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="addressId"
                component={FormikAddressSelect}
                handleSelectAddress={setFieldValue}
                label="Pickup Address"
                labelId="pickup-address"
                userStore={userStore}
                touched={touched.addressId}
                error={errors.addressId}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="deliveryInstructions"
                component={FormikTextInput}
                handleInput={setFieldValue}
                label="Delivery Notes"
                labelId="delivery-notes"
                error={errors.deliveryInstructions ? true : false}
                helperText={errors.deliveryInstructions}
                validate={validateDeliveryInstructions}
                validateField={validateField}
                placeholder="Any special instructions for UPS?"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
              >
                Confirm Pickup
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

function validate(values) {
  const errors = {};
  if (!values.scheduledDate) {
    errors.scheduledDate = "You forgot to select a pickup date!";
  }

  if (!values.earliestTime) {
    errors.earliestTime = "You forgot to select an earliest pickup time!";
  }

  if (!values.latestTime) {
    errors.latestTime = "You forgot to select a latest pickup time!";
  } else if (
    latestTimeIsBeforeEarliestTime(values.earliestTime, values.latestTime)
  ) {
    errors.latestTime =
      "Your latest pickup time must come after your earliest pickup time.";
  }

  if (!values.addressId) {
    errors.addressId = "You forgot to select a pickup address!";
  }

  return errors;
}

function validateDeliveryInstructions(value) {
  let error;
  if (value && value.length > 57) {
    error = "Your delivery instructions can't be longer than 57 characters.";
  }
  return error;
}

function latestTimeIsBeforeEarliestTime(earliestTime, latestTime) {
  const earliest = moment(earliestTime, "hh:mm a");
  const latest = moment(latestTime, "hh:mm a");

  return latest.isBefore(earliest);
}
