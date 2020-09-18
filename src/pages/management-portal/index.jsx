import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, MenuItem, Paper } from '@material-ui/core';
import DisplayContent from './DisplayContent';
import SidebarContent from './SidebarContent';

export default function ManagementPortal({ sidebar, content }) {
  return (
    <Box mx={4} my={2} borderRadius="4px">
      <Paper elevation={1}>
        <Box display="flex" height="84vh">
          <Grid container>
            <Grid item lg={2}>
              <SidebarContent>{sidebar}</SidebarContent>
            </Grid>
            <Grid item lg={10}>
              <DisplayContent>{content}</DisplayContent>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

ManagementPortal.propTypes = {
  sidebar: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
};

export function SidebarItem({ selected, setSelected, store, title, content }) {
  const onClick = () => {
    store.setActiveContent(content);
    setSelected(title);
  };

  return (
    <MenuItem onClick={onClick} selected={selected === title}>
      {title}
    </MenuItem>
  );
}

SidebarItem.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
};
