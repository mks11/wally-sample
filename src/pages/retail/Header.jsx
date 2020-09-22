import React from 'react';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Typography, Input, InputAdornment } from '@material-ui/core';
import { Add, Search } from '@material-ui/icons';
export default function Header({ onAdd, title, placeholder }) {
  return (
    <Box display={'flex'} m={2} alignItems="center">
      <Box flex={1}>
        <PrimaryWallyButton startIcon={<Add />} onClick={onAdd}>
          {title}
        </PrimaryWallyButton>
      </Box>
      <Box flexGrow={1}>
        <Input
          startAdornment={
            <InputAdornment>
              <Search />
            </InputAdornment>
          }
          type="text"
          placeholder={placeholder}
          fullWidth
          color="primary"
        />
      </Box>
    </Box>
  );
}
