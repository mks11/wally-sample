import React from 'react';

// Node Modules
import PropTypes from 'prop-types';

// npm Packaged Components
import { Box, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
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

export function DesktopNavItem({ to, text }) {
  return (
    <Box px={1} py={2}>
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

export const DesktopDropdownMenuListItem = styled.li`
  && {
    position: relative;
    margin: 0;
    text-transform: none;
    background-color: transparent;
    color: #212529;
    cursor: pointer;
  }
`;

export const DesktopDropdownMenuLink = styled(Link)`
  &&& {
    display: inline-block;
    padding: 1.5em 3em;
    width: 100%;
    color: #000;
    &:hover {
      background-color: rgba(153, 175, 255, 0.5);
      text-decoration: none;
    }
  }
`;

export const DesktopDropdownMenuButton = styled.button`
  &&& {
    display: inline-block;
    padding: 1.5em 3em;
    width: 100%;
    color: #000;
    -webkit-appearance: none;
    background-color: transparent;
    border: none;
    &:hover {
      background-color: rgba(153, 175, 255, 0.5);
      text-decoration: none;
    }
  }
`;

export function DesktopDropdownMenuItem({ onClick, children, to }) {
  const theme = useTheme();
  return (
    <DesktopDropdownMenuListItem>
      <DesktopDropdownMenuLink onClick={onClick} to={to} theme={theme}>
        <Typography>{children}</Typography>
      </DesktopDropdownMenuLink>
    </DesktopDropdownMenuListItem>
  );
}

export function DesktopDropdownMenuBtn({ onClick, children }) {
  const theme = useTheme();
  return (
    <DesktopDropdownMenuListItem>
      <DesktopDropdownMenuButton onClick={onClick} theme={theme}>
        <Typography align="left">{children}</Typography>
      </DesktopDropdownMenuButton>
    </DesktopDropdownMenuListItem>
  );
}
