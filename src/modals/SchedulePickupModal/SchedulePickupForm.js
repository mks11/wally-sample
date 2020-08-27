// Node Modules
import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

// API
import { API_SCHEDULE_PICKUP } from "config";

// Components
import { Formik, Form, Field } from "formik";
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
      {({ setFieldValue }) => (
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
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="deliveryInstructions"
                component={FormikTextInput}
                handleInput={setFieldValue}
                label="Delivery Notes"
                labelId="delivery-notes"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="secondary">
                Confirm Pickup
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

function ErrorInfo(props) {
  return props.invalidText ? (
    <div className="container">
      <span className="text-error text-center my-3">{props.invalidText}</span>
    </div>
  ) : null;
}

function InputErrors({ errors }) {
  if (errors && errors.length < 1) {
    return null;
  }
  return (
    <div className="container">
      <span className="text-error text-center my-3">{`Invalid ${
        errors.length > 1 ? "inputs" : "input"
      }`}</span>
      <ul>
        {errors.map((msg, i) => (
          <li key={i} className="text-error util-font-size-14">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

// function getUPSFormattedDate(date) {
//   return moment(date).format("YYYYMMDD");
// }
