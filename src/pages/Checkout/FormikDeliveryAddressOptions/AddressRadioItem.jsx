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
  selected_id,
  isPreferredAddress,
  value,
}) {
  const classes = useStyles();

  return (
    <Box display="flex">
      <FormControlLabel
        control={<Radio color="primary" />}
        classes={{ root: classes.root, label: classes.label }}
        value={value}
        checked={value === selected_id}
        label={
          <Address address={address} isPreferredAddress={isPreferredAddress} />
        }
      />
      <Divider />
    </Box>
  );
}
