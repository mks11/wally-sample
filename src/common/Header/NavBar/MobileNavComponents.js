import React from 'react';
import styled from 'styled-components';

import { formatMoney } from 'utils';

// Hooks
import { useStores } from 'hooks/mobx';

// npm Package Components
import { Button, Divider, IconButton, Typography } from '@material-ui/core';
import { IconContext } from 'react-icons';
import { MdMenu } from 'react-icons/md';

export const MobileNavLinkText = styled(Typography).attrs({
  variant: 'h4',
  component: 'span',
})`
  color: #2d4058;
`;

export const MobileNavButtonWrapper = styled(Button).attrs({
  variant: 'contained',
})`
  text-align: center;
  min-width: 210px;
  border-radius: 50px;
  padding: 1rem;
  color: #fff;
  margin: 1rem 0;
`;

export const MobileNavDivider = styled(Divider)`
  margin: 1rem 0;
`;

export function MobileNavButton({ onClick, children }) {
  return (
    <MobileNavButtonWrapper onClick={onClick} color="primary">
      <Typography variant="h4" component="span">
        {children}
      </Typography>
    </MobileNavButtonWrapper>
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
      <IconContext.Provider value={{ size: '1.5em' }}>
        <MdMenu />
      </IconContext.Provider>
    </IconButton>
  );
}
