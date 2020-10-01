// Node Modules
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';
import { isMobile } from 'react-device-detect';

// Hooks
import { useStores } from 'hooks/mobx';

// API
import { API_SCHEDULE_PICKUP } from 'config';

// Components
import { Formik, Form, Field } from 'formik';
import { Button, Grid, Typography } from '@material-ui/core';
import FormikDateSelect from 'common/FormikDateSelect/FormikDateSelect';
import FormikTimeSelect from 'common/FormikTimeSelect';
import FormikAddressSelect from 'common/FormikAddressSelect';
import FormikTextInput from 'common/FormikTextInput';

export default function SchedulePickupForm() {
  const { loading, user } = useStores();
  return (
    <Formik
      initialValues={{
        addressId: '',
        scheduledDate: '',
        earliestTime: '',
        latestTime: '',
        pickupInstructions: '',
      }}
      validate={validate}
      onSubmit={(values, actions) => {
        loading.show();
        axios
          .post(API_SCHEDULE_PICKUP, values, user.getHeaderAuth())
          .then((res) => {
            const { earliestTime, latestTime } = res.data;
            const date = moment(earliestTime).format('dddd, MMMM Do');
            const start = moment(earliestTime).format('h:mm A');
            const end = moment(latestTime).format('h:mm A');
            const successMsg = `Your packaging pickup was scheduled for ${date}, beginning at ${start} and ending at ${end}. Check your email for confirmation.`;
            setTimeout(
              () => modalStore.switchModal('success', successMsg),
              600,
            );
          })
          .catch(() => {
            // Handle Error
            setTimeout(
              () =>
                modalStore.switchModal(
                  'error',
                  'A problem occurred while your packaging pickup was being scheduled. Please contact us at info@thewallyshop.co so we can help you schedule your pickup.',
                ),
              600,
            );
          })
          .finally(() => {
            setTimeout(() => loading.hide(), 300);
            actions.setSubmitting(false);
          });
      }}
    >
      {({
        errors,
        isSubmitting,
        setFieldValue,
        touched,
        validateField,
        values,
      }) => {
        {
          /* Calculate range of earliest availabilities */
        }
        const lowerEarliestTimeBound = getLowerEarliestTimeBound(
          values.scheduledDate,
        );
        const upperEarliestTimeBound = getUpperEarliestTimeBound(
          values.scheduledDate,
        );
        const earliestRange = getPickupTimes(
          lowerEarliestTimeBound,
          upperEarliestTimeBound,
          60,
        );

        {
          /* Calculate range of latest availabilities */
        }
        const lowerLatestTimeBound = getLowerLatestTimeBound(
          values.earliestTime,
        );
        const upperLatestTimeBound = getUpperLatestTimeBound(
          values.earliestTime,
        );
        const latestRange = getPickupTimes(
          lowerLatestTimeBound,
          upperLatestTimeBound,
          60,
        );

        return (
          <Form>
            <Grid container justify="center" spacing={4}>
              <Typography variant="h1" gutterBottom>
                Schedule Pickup
              </Typography>
              <Grid item xs={12}>
                <Field
                  name="scheduledDate"
                  component={FormikDateSelect}
                  customInput={<DateInput />}
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
                  timeRange={earliestRange}
                  touched={touched.earliestTime}
                  error={errors.earliestTime}
                  disabled={values.scheduledDate ? false : true}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Field
                  name="latestTime"
                  component={FormikTimeSelect}
                  handleSelectTime={setFieldValue}
                  labelId="latest-pickup-time"
                  label="Latest Pickup Time"
                  timeRange={latestRange}
                  touched={touched.latestTime}
                  error={errors.latestTime}
                  disabled={values.earliestTime ? false : true}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="addressId"
                  component={FormikAddressSelect}
                  handleSelectAddress={setFieldValue}
                  label="Pickup Address"
                  labelId="pickup-address"
                  userStore={user}
                  touched={touched.addressId}
                  error={errors.addressId}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="pickupInstructions"
                  component={FormikTextInput}
                  handleInput={setFieldValue}
                  label="Pickup Instructions"
                  labelId="pickup-instructions"
                  error={errors.pickupInstructions ? true : false}
                  helperText={errors.pickupInstructions}
                  validate={validateDeliveryInstructions}
                  validateField={validateField}
                  placeholder="Any special instructions for UPS?"
                />
              </Grid>
              <Grid item xs={10}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  style={{ padding: isMobile ? '1.5rem 2rem' : undefined }}
                >
                  <Typography
                    variant="h3"
                    component="span"
                    style={{ color: '#fff' }}
                  >
                    Confirm Pickup
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
}

function DateInput({ value, onClick }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      fullWidth
      style={{ padding: isMobile ? '1.5rem 2rem' : undefined }}
    >
      <Typography variant="body1" color="textSecondary">
        {value || 'Select a pickup date.'}
      </Typography>
    </Button>
  );
}

/**
 * Return the lower bound of the earliest available time - 9:00 AM wherever the user is located.
 *
 * @param {Date} date - Scheduled date of pickup
 */
function getLowerEarliestTimeBound(date) {
  if (date) {
    return moment(date).hour(9);
  }

  return;
}

/**
 * Return the upper bound of the earliest available time - 3:00 PM wherever the user is located.
 *
 * @param {Date} date - Scheduled date of pickup
 */
function getUpperEarliestTimeBound(date) {
  if (date) {
    return moment(date).hour(15);
  }

  return;
}

/**
 * Return the lower bound of the latest available time - earliestTime + 2 hours wherever the user is located.
 *
 * @param {Date} earliestTime - Earliest availability of pickup
 */
function getLowerLatestTimeBound(earliestTime) {
  if (earliestTime) {
    return moment(earliestTime).add(2, 'h');
  }

  return;
}

/**
 * Return the upper bound of the latest available time - upper earliestTime + 2 hours wherever the user is located.
 *
 * @param {Date} earliestTime - Earliest availability of pickup
 */
function getUpperLatestTimeBound(earliestTime) {
  if (earliestTime) {
    return moment(earliestTime).hour(17);
  }

  return;
}

/**
 * Generate a range of pickup times between the start and end time.
 *
 * @param {Moment} startTime - first time point - moment object
 * @param {Moment} endTime - last time point - moment object
 * @param {Number} intervalInMins - interval between times.
 */
function getPickupTimes(startTime, endTime, intervalInMins = 60) {
  if (startTime && endTime) {
    const result = [startTime.toISOString(true)];

    var currentTime = startTime.toISOString(true);
    while (
      moment(currentTime).add(intervalInMins, 'm').isSameOrBefore(endTime)
    ) {
      currentTime = moment(currentTime)
        .add(intervalInMins, 'm')
        .toISOString(true);
      result.push(currentTime);
    }

    return result;
  }

  return [];
}

function validate(values) {
  const errors = {};
  if (!values.scheduledDate) {
    errors.scheduledDate = 'You forgot to select a pickup date!';
  }

  if (!values.earliestTime) {
    errors.earliestTime = 'You forgot to select an earliest pickup time!';
  }

  if (!values.latestTime) {
    errors.latestTime = 'You forgot to select a latest pickup time!';
  } else if (
    latestTimeIsBeforeEarliestTime(values.earliestTime, values.latestTime)
  ) {
    errors.latestTime =
      'Your latest pickup time must come after your earliest pickup time.';
  }

  if (!values.addressId) {
    errors.addressId = 'You forgot to select a pickup address!';
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
  const earliest = moment(earliestTime, 'hh:mm a');
  const latest = moment(latestTime, 'hh:mm a');

  return latest.isBefore(earliest);
}
