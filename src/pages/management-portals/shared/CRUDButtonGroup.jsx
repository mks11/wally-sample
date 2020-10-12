import React, { useState } from 'react';
import PropTypes from 'prop-types';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Material UI
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Edit, Delete, MoreHoriz } from '@material-ui/icons';

function CRUDButtonGroup({ onUpdate, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    onUpdate && onUpdate();
    handleClose();
  };

  const handleDelete = () => {
    onDelete && onDelete();
    handleClose();
  };

  const { user } = useStores();

  return user.user ? (
    <Box>
      <IconButton aria-label="menu" onClick={handleClick}>
        <MoreHoriz />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleUpdate}>
          <Box display="flex" alignItems="center">
            <Edit />{' '}
            <Typography variant="body1" style={{ marginLeft: '0.25rem' }}>
              Edit
            </Typography>
          </Box>
        </MenuItem>
        {user.isAdmin && (
          <MenuItem onClick={handleDelete}>
            <Box display="flex" alignItems="center">
              <Delete />{' '}
              <Typography variant="body1" style={{ marginLeft: '0.25rem' }}>
                Remove
              </Typography>
            </Box>
          </MenuItem>
        )}
      </Menu>
    </Box>
  ) : null;
}

CRUDButtonGroup.propTypes = {
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default observer(CRUDButtonGroup);
