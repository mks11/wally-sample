import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

export const DesktopNavLink = styled(Link)`
  display: block;
  position: relative;
  padding: 0;
  cursor: pointer;
  text-decoration: none;
  background-color: transparent;
  border-bottom: 2px solid transparent;

  &:hover {
    border-bottom: 2px solid #222;
  }
`;

export const DesktopNavLinkText = styled(Typography).attrs({
  variant: "body2",
  component: "span",
})`
  color: #000;
  font-weight: normal;

  &:hover {
    color: #222;
  }
`;
