import React from 'react';

import { formatMoney } from 'utils';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Divider, IconButton, ListItem, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

// Styles
import styled from 'styled-components';

export const MobileNavLink = styled(Link)`
  padding: 1.5em 3em;
  width: 100%;
`;

export const MobileNavLinkText = styled(Typography).attrs({
  variant: 'h4',
  component: 'span',
})`
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
  padding: 1.5em 3em;
  width: 100%;
  color: #000;
  -webkit-appearance: none;
  background-color: transparent;
  border: none;
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

const WavingHand = styled.span`
  margin-left: 0.25rem;
`;

export function MobileUserGreeting({ userName }) {
  return (
    <MobileNavLinkText>
      Hello {userName}
      <WavingHand role="img" aria-label="Waving Hand">
        👋
      </WavingHand>
    </MobileNavLinkText>
  );
}

export function MobileUserPackagingBalance({ balance }) {
  const formattedBalance = formatMoney(balance / 100);
  return (
    <MobileNavLinkText>
      Packaging Balance ({formattedBalance})
    </MobileNavLinkText>
  );
}

export function MobileNavMenu({ children }) {
  const { modalV2 } = useStores();
  const openNav = () => modalV2.open(children);
  return (
    <IconButton aria-label="menu" onClick={openNav}>
      <MenuIcon fontSize="large" style={{ color: '#000' }} />
    </IconButton>
  );
}
