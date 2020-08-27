// Node Modules
import React from "react";
import PropTypes from "prop-types";

// Utilities
import { isValidTimeOrder, genTimePoints } from "../../utils";

// API
import { API_SCHEDULE_PICKUP } from "config";

// Components
import { Formik, Form, Field } from "formik";
import { Button, Grid, Typography } from "@material-ui/core";
import FormikDateSelect from "common/FormikDateSelect";
import TimeOnlyOptions from "../../common/TimeOnlyOptions";
import AddressOptionsManaged from "./AddressOptionsManaged";

const INVALID_TIME = "pick a different time";

export default function SchedulePickupForm({ userStore, modalStore }) {
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
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <Grid container justify="center" spacing={4}>
            <Typography variant="h1" gutterBottom>
              Schedule Pickup
            </Typography>

            <Grid item xs={12}>
              <Typography variant="h2" gutterBottom>
                Date
              </Typography>
              <Field
                name="scheduledDate"
                component={FormikDateSelect}
                handleSelectDate={setFieldValue}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TimeOnlyOptions
                title={"Earliest pickup time"}
                lock={false}
                placeholderText="Pick an earliest pickup time"
                data={genTimePoints(
                  values.earliestTime,
                  values.latestTime,
                  60
                ).map((p) => ({ time: p }))}
                onSelectTime={this.handleSelectEarliestTime}
              />
            </Grid>
            <Grid item xs={12}>
              <TimeOnlyOptions
                title={"Latest pickup time"}
                lock={false}
                placeholderText="Pick a latest pickup time"
                data={genTimePoints(
                  this.state.earliestTime,
                  this.props.latestTime,
                  60
                ).map((p) => ({ time: p }))}
                onSelectTime={this.handleSelectLatestTime}
                invalidText={this.state.invalidLatestTime && INVALID_TIME}
              />
            </Grid>
            <Grid item xs={12}>
              <AddressOptionsManaged
                title={"Pickup Address"}
                store={this.props.store}
              />
            </Grid> */}
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
