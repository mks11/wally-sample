import { FormControlLabel, Radio, makeStyles } from '@material-ui/core';
import React from 'react';
import { RadioGroup as RadioGroupMui, Box } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
  },
  label: {
    width: '100%',
  },
}));

export default function RadioGroup({
  items,
  valueFn,
  onChange,
  isChecked,
  Label,
  ...rest
}) {
  const classes = useStyles();

  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <RadioGroupMui onChange={handleChange}>
      {items.map((item, index) => (
        <Box key={item.id || index}>
          <FormControlLabel
            control={<Radio color="primary" />}
            classes={{ root: classes.root, label: classes.label }}
            value={valueFn ? valueFn(item) : item}
            checked={isChecked && isChecked(item)}
            label={<Label item={item} />}
            {...rest}
          />
        </Box>
      ))}
    </RadioGroupMui>
  );
}
