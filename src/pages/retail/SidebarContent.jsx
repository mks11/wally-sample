import React from 'react';
import { MenuItem, MenuList } from '@material-ui/core';

export default function SidebarContent({ onClick, selected }) {
  const ITEMS = ['Categories', 'Packaging'];

  return (
    <MenuList>
      {ITEMS.map((item) => (
        <MenuItem
          selected={item === selected}
          key={item}
          onClick={() => onClick(item)}
        >
          {item}
        </MenuItem>
      ))}
    </MenuList>
  );
}
