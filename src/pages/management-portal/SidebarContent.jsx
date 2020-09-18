import React from 'react';
import { Box, MenuList } from '@material-ui/core';

export default function SidebarContent({ children }) {
  return (
    <Box flex={1} bgcolor="#eeefff" overflow="auto">
      <MenuList>{children}</MenuList>
    </Box>
  );
}
