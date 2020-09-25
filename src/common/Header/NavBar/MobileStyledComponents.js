import React from "react";
import styled from "styled-components";
import { Button, Divider, Typography } from "@material-ui/core";
import { formatMoney } from "utils";

export const MobileNavLinkText = styled(Typography).attrs({
  variant: "h4",
  component: "span",
})`
  color: #2d4058;
`;

export const MobileNavButtonWrapper = styled(Button).attrs({
  variant: "contained",
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
