import { FormControlLabel, Radio, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { RadioGroup as RadioGroupMui, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
    // alignItems: 'flex-start',
  },
  label: {
    width: '100%',
  },
}));

export default function RadioGroup({
  items,
  valueFn,
  selected: propSelected,
  onChange,
  checked,
  Label,
}) {
  const classes = useStyles();
  const [selected, setSelected] = useState(propSelected);

  const handleChange = (e) => {
    setSelected(e.target.value);
    onChange && onChange(e.target.value);
  };

  function isChecked(item) {
    if (valueFn) {
      return valueFn(item) === selected;
    } else {
      return item === selected;
    }
  }

  return (
    <RadioGroupMui onChange={handleChange}>
      {items.map((item, index) => (
        <Box key={item.id || index}>
          <FormControlLabel
            control={<Radio color="primary" />}
            classes={{ root: classes.root, label: classes.label }}
            value={valueFn ? valueFn(item) : item}
            checked={checked || isChecked(item)}
            label={<Label item={item} />}
          />
        </Box>
      ))}
    </RadioGroupMui>
  );
}
