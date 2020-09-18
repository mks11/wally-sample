import React from 'react';
import PropTypes from 'prop-types';
import { Link as RLink } from 'react-router-dom';
import {
  DesktopDropdownMenuItem,
  DesktopDropdownMenuLink,
} from './DesktopNavComponents';
import {
  MobileNavButton,
  MobileNavLinkText,
  MobileUserGreeting,
  MobileNavDivider,
} from './MobileStyledComponents';

export function MobileRetailNav({ hideNav, handleSignout, userName }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <Link to="/retail" onClick={hideNav}>
        Home
      </Link>
      <Link to="/main" onClick={hideNav}>
        Shop
      </Link>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
}

MobileRetailNav.propTypes = {
  hideNav: PropTypes.func.isRequired,
};

export function DesktopRetailNav({ hideDropdown, handleSignout }) {
  return (
    <>
      <LinkDesktop to="/retail" onClick={hideDropdown}>
        Home
      </LinkDesktop>
      <LinkDesktop to="/main" onClick={hideDropdown}>
        Shop
      </LinkDesktop>
      <DesktopDropdownMenuItem>
        <a onClick={handleSignout} className="dropdown-item">
          Sign Out
        </a>
      </DesktopDropdownMenuItem>
    </>
  );
}

function Link({ children, ...rest }) {
  return (
    <li>
      <RLink {...rest}>
        <MobileNavLinkText>{children}</MobileNavLinkText>
      </RLink>
    </li>
  );
}

function LinkDesktop(props) {
  return (
    <DesktopDropdownMenuItem>
      <DesktopDropdownMenuLink {...props} />
    </DesktopDropdownMenuItem>
  );
}
