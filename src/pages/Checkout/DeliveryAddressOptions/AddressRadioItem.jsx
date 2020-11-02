import React from 'react';
import {
  makeStyles,
  Box,
  Divider,
  FormControlLabel,
  Radio,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
    alignItems: 'flex-start',
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
  const { street_address, unit, state, zip, name, telephone } = address;

  return (
    <Box>
      <FormControlLabel
        control={<Radio color="primary" />}
        classes={{ root: classes.root, label: classes.label }}
        value={value}
        checked={value === selected}
        label={
          <Box
            display="flex"
            flexWrap="nowrap"
            alignItems="flex-start"
            justifyContent="space-between"
            p={1}
          >
            <Box flexGrow={1} width="100%">
              <Typography variant="body1">
                {street_address} {unit}, {state} {zip}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {name}, {telephone}
              </Typography>
            </Box>
            <Box flexShrink={1}>
              {isPreferredAddress && (
                <Typography variant="h6" component="span" color="primary">
                  DEFAULT
                </Typography>
              )}
            </Box>
          </Box>
        }
      />
      <Divider />
    </Box>
  );
}
