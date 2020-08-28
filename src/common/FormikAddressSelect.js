import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Components
import { Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import { HelperText } from "styled-components-lib/HelperText";
import { Label } from "styled-components-lib/InputLabel";

const StyledSelect = styled(Select)`
  min-width: 100%;
`;

export default function FormikAddressSelect({
  field,
  handleSelectAddress,
  label,
  labelId,
  userStore,
  ...props
}) {
  const {
    user: { addresses, preferred_address },
  } = userStore;
  const preferredAddress = userStore.getAddressById(preferred_address);
  const handleChange = (event) => {
    handleSelectAddress(field.name, event.target.value);
  };

  return (
    <>
      <Label id={labelId} disabled={props.disabled}>
        {label}
      </Label>
      <StyledSelect
        labelId={labelId}
        defaultValue={preferredAddress.address_id}
        value={field.value || ""}
        onChange={handleChange}
      >
        {addresses.map((address, idx) => (
          <MenuItem key={`${labelId}-${idx}`} value={address.address_id}>
            <Address address={address} />
          </MenuItem>
        ))}
      </StyledSelect>
      <HelperText>{props.touched && props.error ? props.error : ""}</HelperText>
    </>
  );
}

FormikAddressSelect.propTypes = {
  field: PropTypes.object.isRequired,
  handleSelectAddress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
  userStore: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

function Address({ address }) {
  const { name, street_address, unit, city, state, zip } = address;
  let streetAddress = street_address;
  if (unit) {
    streetAddress = `${streetAddress}, ${unit}`;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {name}
      </Grid>
      <Grid item xs={12}>
        {streetAddress}
      </Grid>
      <Grid item xs={12}>
        {`${city}, ${state} ${zip}`}
      </Grid>
    </Grid>
  );
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
};
