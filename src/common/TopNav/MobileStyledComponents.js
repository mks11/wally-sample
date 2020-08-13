import React from "react";
import styled from "styled-components";
import { Button, Typography } from "@material-ui/core";

export const MobileNavLink = styled(Typography).attrs({
  variant: "h4",
  component: "span",
})`
  color: #2d4058;
`;

export const MobileNavButtonWrapper = styled(Button).attrs({
  variant: "contained",
})`
  text-align: center;
  width: 200px;
  border-radius: 50px;
  padding: 1rem;
  color: #fff;
  margin-bottom: 1rem;
`;

export function MobileNavButton({ onClick, text }) {
  return (
    <MobileNavButtonWrapper onClick={onClick} color="primary">
      <Typography variant="h4" component="span">
        {text}
      </Typography>
    </MobileNavButtonWrapper>
  );
}
