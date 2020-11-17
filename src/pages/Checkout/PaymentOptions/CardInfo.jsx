import React from 'react';
import { Typography, Box, TextField } from '@material-ui/core';
import cardIcon from 'images/card.png';
export default function CardInfo({
  _id,
  last4,
  brand,
  exp_year,
  exp_month,
  isPreferred,
  onCVVChange,
  showCVVInput,
}) {
  return (
    <Box p={1} display="flex">
      <Box flexGrow={1}>
        <Box display="flex" alignItems="center">
          <Box mr={1}>
            <img src={cardIcon} alt="" />
          </Box>
          <Typography>{brand}</Typography>
        </Box>
        <Box>
          <Typography>
            {'xxxx-xxxx-xxxx -'} <b>{last4}</b>
          </Typography>
          <Typography>
            Expiration: {exp_month} / {exp_year}
          </Typography>
        </Box>
        {showCVVInput && (
          <Box>
            <TextField placeholder="CVC" onChange={onCVVChange} />
          </Box>
        )}
      </Box>
      <Box flexShrink={1}>
        {isPreferred && (
          <Typography variant="h6" component="span">
            Preferred
          </Typography>
        )}
      </Box>
    </Box>
  );
}
