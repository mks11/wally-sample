import React, { useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Box, Button, Menu, MenuItem, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

const MenuButton = styled(Button)`
  &:hover {
    background-color: transparent;
  }
`;

const AccountDropdown = ({ children, ...props }) => {
  const { user: userStore } = useStores();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let elements = React.Children.toArray(children).map((c) =>
    React.cloneElement(c, { onClick: handleClose }),
  );

  return (
    <>
      <MenuButton
        aria-label="account"
        disableRipple
        onClick={handleClick}
        style={{ padding: '8px 16px' }}
      >
        <Box position="relative" display="flex" alignItems="center">
          <Typography variant="body1" component="span">
            {userStore.user ? 'Account' : 'Sign in'}
          </Typography>
          <ArrowDropDownIcon />
        </Box>
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {elements}
        {userStore.user ? (
          <AccountDropdownMenuListItem>
            <SignOutButton />
          </AccountDropdownMenuListItem>
        ) : null}
      </Menu>
    </>
  );
};

export default observer(AccountDropdown);

export const AccountDropdownMenuLink = styled(Link)`
  &&& {
    display: inline-block;
    padding: 1em 1.5em;
    width: 100%;
    color: #000;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const AccountDropdownMenuListItem = styled(MenuItem)`
  && {
    position: relative;
    margin: 0;
    padding: 0;
    text-transform: none;
    background-color: transparent;
    color: #212529;
    cursor: pointer;
    min-width: 200px;
    &:hover {
      background-color: rgba(153, 175, 255, 0.5);
    }
  }
`;

export const AccountDropdownMenuButton = styled.button`
  &&& {
    display: inline-block;
    padding: 1em 1.5em;
    width: 100%;
    color: #000;
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
  }
`;

export function AccountDropdownMenuItem({ onClick, children, to }) {
  return (
    <AccountDropdownMenuLink onClick={onClick} to={to}>
      <Typography>{children}</Typography>
    </AccountDropdownMenuLink>
  );
}

export function AccountDropdownMenuBtn({ onClick, children }) {
  return (
    <AccountDropdownMenuButton onClick={onClick}>
      <Typography align="left">{children}</Typography>
    </AccountDropdownMenuButton>
  );
}

function SignOutButton() {
  const { checkout, routing, user } = useStores();

  function handleLogout() {
    checkout.cart = null;
    checkout.order = null;
    user.logout();
    routing.push('/');
  }

  return (
    <AccountDropdownMenuBtn onClick={handleLogout}>
      Sign Out
    </AccountDropdownMenuBtn>
  );
}
