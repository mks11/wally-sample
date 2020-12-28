import React from 'react';
import {
  makeStyles,
  Box,
  Divider,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import Address from 'common/Address';

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
  preferredAddressId,
}) {
  const classes = useStyles();
  const value = address._id;
  const isSelected = value === selected._id;

  return (
    <Box display="flex">
      <FormControlLabel
        control={<Radio color="primary" />}
        classes={{ root: classes.root, label: classes.label }}
        value={value}
        checked={isSelected}
        label={
          <Address address={address} preferredAddressId={preferredAddressId} />
        }
      />
      <Divider />
    </Box>
  );
}
