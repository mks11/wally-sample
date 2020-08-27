import React from "react";
import moment from "moment";
import DatePicker from "react-datepicker";

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

  const earliestDate = moment().add(1, "d").toDate();

  return (
    <DatePicker
      dateFormat={"MM / dd / yyyy"}
      selected={field.value || undefined}
      minDate={earliestDate}
      onSelect={selectDate}
      filterDate={isValidPickupDay}
      placeholderText="Select a pickup date."
      className={`form-control p-4 util-font-size-16`}
    />
  );
}
