import React, { useState, useEffect } from 'react';
import { useField, useFormikContext } from 'formik';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Input,
  MenuItem,
  FormControl,
  ListItemText,
  Select,
  Checkbox,
  Chip,
} from '@material-ui/core';
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

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(value, selectedValues, theme) {
  return {
    fontWeight:
      selectedValues.indexOf(value) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultiSelect({ label, values, ...props }) {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState([]);

  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    setSelectedValues(event.target.value);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const arr = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        arr.push(options[i].value);
      }
    }

    setSelectedValues(arr);
  };

  useEffect(() => {
    setFieldValue(props.id || props.name, selectedValues);
  }, [selectedValues]);

  return (
    <>
      <Label htmlFor={props.id || props.name}>{label} </Label>
      <Select
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<Input fullWidth={true} />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip key={value} label={value} className={classes.chip} />
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
            {val}
          </MenuItem>
        ))}
      </Select>
      <HelperText error={!!(meta.touched && meta.error)}>
        {meta.touched && meta.error}
      </HelperText>
    </>
  );
}
