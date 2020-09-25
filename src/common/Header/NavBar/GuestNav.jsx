import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Hooks
import { useStores } from 'hooks/mobx';

// Services
import { logModalView } from 'services/google-analytics';

// Custom Components
import { Box, Typography } from '@material-ui/core';

// Styled components
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
} from 'common/Header/NavBar/MobileStyledComponents';
import {
  DesktopNavLink,
  DesktopNavLinkText,
} from 'common/Header/NavBar/DesktopNavComponents';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

function MobileGuestNav({ hideNav, handleLogin, handleSignup }) {
  return (
    <>
      <li>
        <MobileNavButton onClick={handleLogin}>Log In</MobileNavButton>
      </li>
      <li>
        <MobileNavButton onClick={handleSignup}>Sign Up</MobileNavButton>
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/latest-news" onClick={hideNav}>
          <MobileNavLinkText>COVID-19</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={hideNav}>
          <MobileNavLinkText>About</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/howitworks" onClick={hideNav}>
          <MobileNavLinkText>How It Works</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={hideNav}>
          <MobileNavLinkText>Blog</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/backers" onClick={hideNav}>
          <MobileNavLinkText>Our Backers</MobileNavLinkText>
        </Link>
      </li>
      {/* <li>
        <Link to="/help" onClick={hideNav}>
          <MobileNavLinkText>Help</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/giftcard" onClick={hideNav}>
          <MobileNavLinkText>Gift Card</MobileNavLinkText>
        </Link>
      </li> */}
    </>
  );
}

MobileGuestNav.propTypes = {
  hideNav: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleSignup: PropTypes.func.isRequired,
};

export function DesktopGuestNav() {
  return (
    <>
      <DesktopNavItem to="/latest-news" text="COVID-19" />
      <DesktopNavItem to="/about" text="About" />
      <DesktopNavItem to="/howitworks" text="How It Works" />
      <DesktopNavItem to="/blog" text="Blog" />
      <LogInButton />
      <SignUpButton />
      <Link to="/backers">
        <span role="img" aria-label="Sparkle">
          ✨
        </span>
      </Link>
    </>
  );
}

DesktopGuestNav.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleBackers: PropTypes.func.isRequired,
};

function DesktopNavItem({ to, text }) {
  return (
    <Box px={1} py={2}>
      <DesktopNavLink to={to}>
        <DesktopNavLinkText>{text}</DesktopNavLinkText>
      </DesktopNavLink>
    </Box>
  );
}

function SignUpButton() {
  const { store } = useStores();

  function handleSignup() {
    logModalView('/signup-zip');
    store.modal.toggleModal('signup');
  }

  return (
    <Box px={1} py={2}>
      <PrimaryWallyButton onClick={handleSignup}>
        <Typography variant="body1">Sign Up</Typography>
      </PrimaryWallyButton>
    </Box>
  );
}

function LogInButton() {
  const { store } = useStores();

  function handleLogin() {
    logModalView('/login');
    store.modal.toggleModal('login');
  }

  return (
    <Box px={1} py={2}>
      <PrimaryWallyButton onClick={handleLogin}>
        <Typography variant="body1">Log In</Typography>
      </PrimaryWallyButton>
    </Box>
  );
}
