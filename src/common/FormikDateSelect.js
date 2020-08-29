import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { HelperText } from 'styled-component-lib/HelperText';
import { Label } from 'styled-component-lib/InputLabel';

export default function FormikDateSelect({
  field,
  handleSelectDate,
  ...props
}) {
  const isValidPickupDay = (date) => {
    const now = moment();
    const calendarDay = moment(date);
    const day = calendarDay.day();

    return day !== 0 && day !== 6 && !calendarDay.isBefore(now);
  };

  const selectDate = (date) => {
    if (date) {
      // Formik setFieldValue method
      handleSelectDate(field.name, date);
    }
  };

  let earliestDate = moment().add(1, 'd');

  // On Fridays, earliestDate will be set to saturday, which is invalid.
  // Automatically move it to Monday.
  while (!isValidPickupDay(earliestDate)) {
    earliestDate = earliestDate.add(1, 'd');
  }
  earliestDate = earliestDate.toDate();

  return (
    <>
      <Label>Pickup Date</Label>
      <DatePicker
        dateFormat={'MM/dd/yyyy'}
        closeOnScroll={false}
        selected={field.value || undefined}
        minDate={earliestDate}
        onSelect={selectDate}
        filterDate={isValidPickupDay}
        placeholderText="Select a pickup date."
        className={`form-control p-4 util-font-size-16`}
      />
      <HelperText>{props.touched && props.error ? props.error : ''}</HelperText>
    </>
  );
}
