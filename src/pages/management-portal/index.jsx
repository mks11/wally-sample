import React from 'react';
import { Box, MenuItem, Paper } from '@material-ui/core';
import DisplayContent from './DisplayContent';
import SidebarContent from './SidebarContent';

export default function ManagementPortal({ sidebar, content }) {
  return (
    <Box mx={4} my={2}>
      <Paper>
        <Box display="flex" height="84vh">
          <SidebarContent>{sidebar}</SidebarContent>
          <DisplayContent>{content}</DisplayContent>
        </Box>
      </Paper>
    </Box>
  );
}

export function SidebarItem({ store, title, content }) {
  const onClick = () => {
    store.setActiveContent(content);
  };

  return <MenuItem onClick={onClick}>{title}</MenuItem>;
}
