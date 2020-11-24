import React from 'react';
import {
  makeStyles,
  Box,
  Divider,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Address from './Address';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: '100%',
  },
}));

export default function AddressRadioItem({
  address,
  selected,
  isPreferredAddress,
  value,
}) {
  const classes = useStyles();
  const parsedVal = JSON.parse(value);
  const isSelected = parsedVal._id === selected._id;

  return (
    <Box display="flex">
      <FormControlLabel
        control={<Radio color="primary" />}
        classes={{ root: classes.root, label: classes.label }}
        value={value}
        checked={isSelected}
        label={
          <Address address={address} isPreferredAddress={isPreferredAddress} />
        }
      />
      <Divider />
    </Box>
  );
}
