import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button } from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';

function CRUDButtonGroup({ onUpdate, onDelete }) {
  return (
    <Box display="flex">
      <Box flex={1}>
        <Button onClick={onUpdate} startIcon={<Edit />}>
          Edit
        </Button>
      </Box>
      <Box flex={1}>
        <Button onClick={onDelete} startIcon={<Delete />}>
          Remove
        </Button>
      </Box>
    </Box>
  );
}

CRUDButtonGroup.propTypes = {
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};

export default CRUDButtonGroup;
