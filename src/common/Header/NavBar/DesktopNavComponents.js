import React from 'react';

// Node Modules
import PropTypes from 'prop-types';

// npm Packaged Components
import { Box, Typography } from '@material-ui/core';
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
  text: PropTypes.string.isRequired,
};

export const DesktopDropdownMenuItem = styled.li`
  && {
    position: relative;
    margin: 0;
    text-transform: none;
    background-color: transparent;
    color: #212529;
    cursor: pointer;

    &:before {
      position: absolute;
      content: '';
      top: 0;
      bottom: 0;
      left: -15px;
      border-left: 2px solid transparent;
      border-left-color: transparent;
    }

    &:hover::before {
      border-left-color: #6060a8;
    }
  }
`;

export const DesktopDropdownMenuLink = styled(Link)`
  &&& {
    display: inline-block;
    margin: 10px 0;
    width: 100%;
    &:hover::after {
      border-bottom: 0.6px solid transparent;
    }
  }
`;
