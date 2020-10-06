import React from 'react';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Typography, Input, InputAdornment } from '@material-ui/core';
import { Add, Search } from '@material-ui/icons';
export default function Header({
  onAdd,
  buttonText,
  placeholder,
  onSearch,
  showSearchbar = true,
}) {
  const handleChange = (e) => {
    onSearch && onSearch(e.target.value);
  };

  return (
    <Box display={'flex'} m={2} alignItems="center">
      <Box flex={1}>
        <PrimaryWallyButton startIcon={<Add />} onClick={onAdd}>
          {buttonText}
        </PrimaryWallyButton>
      </Box>
      {showSearchbar && (
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
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  );
}
