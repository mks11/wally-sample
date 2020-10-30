import { Box, Button, Typography } from '@material-ui/core';
import React from 'react';

export default function AddressRadioItem({
  data,
  index,
  selected,
  onChange,
  isPreferredAddress,
}) {
  return (
    <Box
      className={
        'custom-control custom-radio bb1' +
        (data.address_id === selected ? ' active' : '')
      }
    >
      <input
        type="radio"
        id={'address-' + index}
        name="customRadio"
        checked={data.address_id === selected}
        className="custom-control-input"
        value={data.address_id}
        onChange={(e) => onChange(data.address_id)}
      />
      <label
        className="custom-control-label"
        htmlFor={'address-' + index}
        onClick={(e) => onChange(data.address_id)}
        style={{ width: '100%' }}
      >
        <Box
          display="flex"
          flexWrap="nowrap"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box flexGrow={1}>
            <Typography variant="body1">
              {data.street_address} {data.unit}, {data.state} {data.zip}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {data.name}, {data.telephone}
            </Typography>
          </Box>
          <Box flexShrink={1}>
            {isPreferredAddress && (
              <Button variant="text">
                <Typography variant="h6" component="span" color="primary">
                  DEFAULT
                </Typography>
              </Button>
            )}
          </Box>
        </Box>
      </label>
    </Box>
  );
}
