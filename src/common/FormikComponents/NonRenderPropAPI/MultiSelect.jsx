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
  preSelected = [],
  ...props
}) {
  const classes = useStyles();
  const theme = useTheme();
  // const selectedSet = new Set();

  // preSelected.forEach((v) => {
  //   selectedSet.add(v);
  // });

  const [selectedValues, setSelectedValues] = useState(preSelected);

  const [meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    setFieldValue(props.id || props.name, selectedValues);
  }, [selectedValues]);

  useEffect(() => {
    if (preSelected.length > 0) {
      setSelectedValues(preSelected);
    }
  }, [preSelected]);

  const handleClickMenuItem = (val) => {
    setSelectedValues((prev) => {
      if (prev.includes(val)) {
        return prev.filter((v) => v !== val);
      } else {
        return [...prev, val];
      }
    });
  };

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label} </Label>
      <Typography variant="subtitle1" gutterBottom>
        Select multiple if applicable
      </Typography>
      <Select
        multiple
        value={selectedValues}
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
        fullWidth
        {...props}
      >
        {values.map((val) => (
          <MenuItem
            key={val}
            value={val}
            style={getStyles(val, selectedValues, theme)}
            onClick={() => handleClickMenuItem(val)}
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
