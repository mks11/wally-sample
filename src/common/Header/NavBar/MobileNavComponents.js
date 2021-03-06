import React, { useState } from 'react';

// mobx
import { observer } from 'mobx-react';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import {
  Divider,
  IconButton,
  ListItem,
  Menu,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

// Styles
import styled from 'styled-components';

export const MobileNavLink = styled(Link)`
  padding: 1.5em;
  width: 100%;
`;

export const MobileNavLinkText = styled(Typography).attrs((props) => ({
  variant: 'h4',
  component: 'span',
}))`
  color: #000;
`;

export function MobileNavItem({ children, hasDivider, onClick, to }) {
  return (
    <ListItem disableGutters divider={hasDivider}>
      <MobileNavLink to={to} onClick={onClick}>
        <MobileNavLinkText>{children}</MobileNavLinkText>
      </MobileNavLink>
    </ListItem>
  );
}

export const MobileNavButton = styled.button`
  display: inline-block;
  padding: 1.5em;
  width: 100%;
  color: #000;
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
`;

export const MobileNavListItem = styled(ListItem)`
  padding: 2.5em 1.5em;
`;

export const MobileNavDivider = styled(Divider)`
  margin: 1rem 0;
`;

export function MobileNavBtn({ onClick, children, hasDivider }) {
  return (
    <ListItem disableGutters divider={hasDivider}>
      <MobileNavButton onClick={onClick}>
        <Typography variant="h4" component="p" align="left">
          {children}
        </Typography>
      </MobileNavButton>
    </ListItem>
  );
}

export const MobileUserGreeting = observer(() => {
  const { user } = useStores();
  var firstName;
  if (user.user && user.user.name) firstName = user.user.name.split(' ')[0];
  return firstName ? (
    <MobileNavListItem>
      <Typography variant="h4" component="span">
        Hello {firstName}
      </Typography>
      <span
        role="img"
        aria-label="Waving Hand"
        style={{ marginLeft: '0.4em', fontSize: '1.6em' }}
      >
        👋
      </span>
    </MobileNavListItem>
  ) : null;
});

export function SignOutButton() {
  const { checkout, modalV2, routing, user } = useStores();

  function handleLogout() {
    checkout.cart = null;
    checkout.order = null;
    user.logout();
    routing.push('/');
    modalV2.close();
  }

  return <MobileNavBtn onClick={handleLogout}>Sign Out</MobileNavBtn>;
}

export function MobileNavMenu({ children }) {
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
      <IconButton aria-label="menu" onClick={handleClick}>
        <MenuIcon fontSize="large" style={{ color: '#000' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        {elements}
      </Menu>
    </>
  );
}
