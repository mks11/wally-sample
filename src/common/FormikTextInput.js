import React from "react";
import PropTypes from "prop-types";

import { HelperText } from "styled-components-lib/HelperText";

// Components
import { InputLabel, TextField } from "@material-ui/core";

export default function FormikTextInput({
  field,
  error,
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
      <InputLabel>{label}</InputLabel>
      <TextField
        value={field.value || ""}
        onChange={handleChange}
        fullWidth
        multiline
        placeholder={props.placeholder}
        error={error}
      />
      <HelperText>{props.helperText || ""}</HelperText>
    </>
  );
}

FormikTextInput.propTypes = {
  field: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  labelId: PropTypes.string.isRequired,
};
