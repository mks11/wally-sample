import React, { useState } from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// Node Modules
import PropTypes from 'prop-types';

// npm Packaged Components
import { Box, Button, Menu, MenuItem, Typography } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { IconContext } from 'react-icons';
import { FaRegUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Styles
import styled from 'styled-components';

export const DesktopNavLink = styled(Link)`
  display: block;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  background-color: transparent;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid rgba(0, 0, 0, 0.5);
    text-decoration: none;
  }
`;

export const DesktopNavLinkText = styled(Typography).attrs({
  variant: 'body1',
  component: 'span',
})`
  color: #000;
  font-weight: normal;

  &:hover {
    color: #222;
  }
`;

const MenuButton = styled(Button)`
  &:hover {
    background-color: transparent;
  }
`;

export function DesktopNavItem({ to, text }) {
  return (
    <Box px={1} py={2} mr={1}>
      <DesktopNavLink to={to}>
        <DesktopNavLinkText>{text}</DesktopNavLinkText>
      </DesktopNavLink>
    </Box>
  );
}

DesktopNavItem.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export const DesktopDropdownMenu = ({ children, ...props }) => {
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
      <MenuButton aria-label="account" disableRipple onClick={handleClick}>
        <Box position="relative">
          <IconContext.Provider value={{ size: '2em' }}>
            <FaRegUserCircle />
          </IconContext.Provider>
          <ArrowDropDownIcon />
          <Typography
            variant="body1"
            component="span"
            style={{ position: 'absolute', bottom: '-16px', left: '0' }}
          >
            Menu
          </Typography>
        </Box>
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {elements}
        <DesktopDropdownMenuListItem>
          <SignOutButton />
        </DesktopDropdownMenuListItem>
      </Menu>
    </>
  );
};

function SignOutButton() {
  const { checkout, routing, user } = useStores();

  function handleLogout() {
    checkout.cart = null;
    checkout.order = null;
    user.logout();
    routing.push('/');
  }

  return (
    <DesktopDropdownMenuBtn onClick={handleLogout}>
      Sign Out
    </DesktopDropdownMenuBtn>
  );
}

export const DesktopDropdownMenuListItem = styled(MenuItem)`
  && {
    position: relative;
    margin: 0;
    padding: 0;
    text-transform: none;
    background-color: transparent;
    color: #212529;
    cursor: pointer;
    &:hover {
      background-color: rgba(153, 175, 255, 0.5);
    }
  }
`;

export const DesktopDropdownMenuLink = styled(Link)`
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

export const DesktopDropdownMenuButton = styled.button`
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

export function DesktopDropdownMenuItem({ onClick, children, to }) {
  return (
    <DesktopDropdownMenuLink onClick={onClick} to={to}>
      <Typography>{children}</Typography>
    </DesktopDropdownMenuLink>
  );
}

export function DesktopDropdownMenuBtn({ onClick, children }) {
  return (
    <DesktopDropdownMenuButton onClick={onClick}>
      <Typography align="left">{children}</Typography>
    </DesktopDropdownMenuButton>
  );
}
