import React, { useState, useEffect } from 'react';
import { useField, useFormikContext } from 'formik';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Input, MenuItem, Select, Chip, Typography } from '@material-ui/core';
import { Label } from 'styled-component-lib/InputLabel';
import { HelperText } from 'styled-component-lib/HelperText';

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

function getStyles(value, selectedValues, theme) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultiSelect({
  label,
  values,
  valueToDisplayMap,
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState([]);

  const [meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    setSelectedValues(event.target.value);
  };

  useEffect(() => {
    setFieldValue(props.id || props.name, selectedValues);
  }, [selectedValues]);

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label} </Label>
      <Typography variant="subtitle1" gutterBottom>
        Select multiple if applicable
      </Typography>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<Input fullWidth={true} />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={valueToDisplayMap ? valueToDisplayMap[value] : value}
                className={classes.chip}
              />
            ))}
          </div>
        )}
        error={!!(meta.touched && meta.error)}
        fullWidth={true}
        {...props}
      >
        {values.map((val) => (
          <MenuItem
            key={val}
            value={val}
            style={getStyles(val, selectedValues, theme)}
          >
            {valueToDisplayMap ? valueToDisplayMap[val] : val}
          </MenuItem>
        ))}
      </Select>
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error}
      </HelperText>
    </>
  );
}
