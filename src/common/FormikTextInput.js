import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Components
import { InputLabel, TextField } from "@material-ui/core";

export default function FormikTimeSelect({
  field,
  handleInput,
  label,
  labelId,
  ...props
}) {
  const handleChange = (event) => {
    handleInput(field.name, event.target.value);
  };

  return (
    <>
      <InputLabel id={labelId}>{label}</InputLabel>
      <TextField
        labelId={labelId}
        value={field.value || ""}
        onChange={handleChange}
        fullWidth
        multiline
        placeholder="Any special instructions for UPS?`"
      />
    </>
  );
}

FormikTimeSelect.propTypes = {
  field: PropTypes.object.isRequired,
  handleSelectTime: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
};
