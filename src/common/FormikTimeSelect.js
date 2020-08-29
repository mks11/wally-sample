import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

// Components
import { MenuItem, Select } from '@material-ui/core';
import { BrowserView, MobileView } from 'react-device-detect';
import { HelperText } from 'styled-component-lib/HelperText';
import { Label } from 'styled-component-lib/InputLabel';

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

  return (
    <>
      <Label id={labelId} disabled={props.disabled}>
        {label}
      </Label>
      <MobileView>
        <StyledSelect
          labelId={labelId}
          native
          value={field.value || ''}
          onChange={handleChange}
        >
          {props.timeRange.map((time, idx) => (
            <option key={`${labelId}-${idx}`} value={time}>
              {moment(time).format('LT')}
            </option>
          ))}
        </StyledSelect>
      </MobileView>
      <BrowserView>
        <StyledSelect
          labelId={labelId}
          value={field.value || ''}
          disabled={props.disabled}
          onChange={handleChange}
        >
          {props.timeRange.map((time, idx) => (
            <MenuItem key={`${labelId}-${idx}`} value={time}>
              {moment(time).format('LT')}
            </MenuItem>
          ))}
        </StyledSelect>
      </BrowserView>
      <HelperText>{props.touched && props.error ? props.error : ''}</HelperText>
    </>
  );
}

FormikTimeSelect.propTypes = {
  field: PropTypes.object.isRequired,
  handleSelectTime: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  timeRange: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
};