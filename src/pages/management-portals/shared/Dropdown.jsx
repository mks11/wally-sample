import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

export default function Dropdown({ title, collection = [] }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button onClick={handleClick} startIcon={<ArrowDropDown />}>
        {title}
      </Button>
      <Menu
        keepMounted
        open={anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {collection.length > 0 ? (
          collection.map((col) => (
            <MenuItem onClick={handleClose} key={col}>
              {col}
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <em> Not Found </em>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
