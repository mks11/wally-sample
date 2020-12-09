import React from 'react';

// Node Modules
import PropTypes from 'prop-types';

// npm Packaged Components
import { Box, MenuItem, Typography } from '@material-ui/core';

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

export const DesktopNavLinkText = styled(Typography).attrs((props) => ({
  variant: 'body1',
  component: 'span',
}))`
  color: #000;
  font-weight: normal;

  &:hover {
    color: #222;
  }
`;

export function DesktopNavItem({ to, text }) {
  return (
    <Box px={1} py={2} display="flex" alignItems="center">
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
