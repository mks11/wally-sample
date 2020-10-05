import React from 'react';
import PropTypes from 'prop-types';
import { Box, MenuList } from '@material-ui/core';

export default function SidebarContent({ children }) {
  return (
    <Box bgcolor="#f5f5f5" overflow="auto" height="100%">
      <MenuList>{children}</MenuList>
    </Box>
  );
}

SidebarContent.propTypes = {
  children: PropTypes.node.isRequired,
};
