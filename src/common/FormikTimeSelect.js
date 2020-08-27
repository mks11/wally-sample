import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styled from "styled-components";

// Components
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { BrowserView, MobileView } from "react-device-detect";

const StyledSelect = styled(Select)`
  min-width: 100%;
`;

export default function FormikTimeSelect({
  field,
  handleSelectTime,
  label,
  labelId,
  ...props
}) {
  const handleChange = (event) => {
    handleSelectTime(field.name, event.target.value);
  };

  const pickupTimes = getPickupTimes(
    props.earliestTime,
    props.latestTime,
    props.interval
  );

  return (
    <>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MobileView>
        <StyledSelect
          labelId={labelId}
          native
          value={field.value || ""}
          onChange={handleChange}
        >
          {pickupTimes.map((time, idx) => (
            <option key={`${labelId}-${idx}`} value={time}>
              {time}
            </option>
          ))}
        </StyledSelect>
      </MobileView>
      <BrowserView>
        <StyledSelect
          labelId={labelId}
          value={field.value || ""}
          onChange={handleChange}
        >
          {pickupTimes.map((time, idx) => (
            <MenuItem key={`${labelId}-${idx}`} value={time}>
              {time}
            </MenuItem>
          ))}
        </StyledSelect>
      </BrowserView>
    </>
  );
}

FormikTimeSelect.propTypes = {
  field: PropTypes.object.isRequired,
  handleSelectTime: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  earliestTime: PropTypes.object.isRequired,
  latestTime: PropTypes.object.isRequired,
  interval: PropTypes.number,
};

/**
 * Generate a range of pickup times between the start and end time.
 *
 * @param {String} startTime - first time point - 'HH:MM AM'
 * @param {String} endTime - last time point - 'HH:MM PM'
 * @param {Number} intervalInMins - interval between times.
 */
function getPickupTimes(startTime, endTime, intervalInMins = 60) {
  const start = moment(startTime);
  const end = moment(endTime);
  const result = [start.format("LT")];

  var currentTime = start;
  while (moment(currentTime).isBefore(end)) {
    currentTime = start.add(intervalInMins, "minutes");
    result.push(currentTime.format("LT"));
  }

  return result;
}
