import React from 'react';
import PropTypes from 'prop-types';

// Hooks
import { useStores } from 'hooks/mobx';

// Services
import { logModalView } from 'services/google-analytics';

// npm Package Components
import { Box, List, Typography } from '@material-ui/core';

// Custom Components
import LoginForm from 'forms/authentication/LoginForm';
import SignupForm from 'forms/authentication/SignupForm';

// Styled components
import {
  MobileNavItem,
  MobileNavBtn,
  MobileNavMenu,
} from 'common/Header/NavBar/MobileNavComponents';
import { BackButton } from 'common/ModalNavigation';
import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';
import { ColorfulWallyButton } from 'styled-component-lib/Buttons';

export function MobileGuestNav() {
  return (
    <MobileNavMenu>
      <MobileGuestNavMenu />
    </MobileNavMenu>
  );
}

function MobileGuestNavMenu() {
  const { modalV2 } = useStores();

  return (
    <List>
      <MobileLogInButton />
      <MobileSignUpButton />
      <MobileNavItem to="/latest-news" onClick={modalV2.close} hasDivider>
        COVID-19
      </MobileNavItem>
      <MobileNavItem to="/about" onClick={modalV2.close} hasDivider>
        About
      </MobileNavItem>
      <MobileNavItem to="/howitworks" onClick={modalV2.close} hasDivider>
        How It Works
      </MobileNavItem>
      <MobileNavItem to="/blog" onClick={modalV2.close} hasDivider>
        Blog
      </MobileNavItem>
      <MobileNavItem to="/backers" onClick={modalV2.close}>
        Our Backers
      </MobileNavItem>
      {/* <MobileNavItem to="/help" onClick={modalV2.close} hasDivider>
        Help
      </MobileNavItem> */}
      {/* <MobileNavItem to="/giftcard" onClick={modalV2.close}>
        Gift Card
      </MobileNavItem> */}
    </List>
  );
}

function MobileLogInButton() {
  const { modalV2 } = useStores();
  const login = () => {
    modalV2.open(
      <>
        <BackButton>
          <MobileGuestNavMenu />
        </BackButton>
        <LoginForm />
      </>,
    );
  };
  return (
    <MobileNavBtn onClick={login} hasDivider>
      Log In
    </MobileNavBtn>
  );
}

function MobileSignUpButton() {
  const { modalV2 } = useStores();
  const signup = () => {
    modalV2.open(
      <>
        <BackButton>
          <MobileGuestNavMenu />
        </BackButton>
        <SignupForm />
      </>,
    );
  };
  return (
    <MobileNavBtn onClick={signup} hasDivider>
      Sign Up
    </MobileNavBtn>
  );
}

export function DesktopGuestNav() {
  return (
    <>
      <DesktopNavItem to="/latest-news" text="COVID-19" />
      <DesktopNavItem to="/about" text="About" />
      <DesktopNavItem to="/howitworks" text="How It Works" />
      <DesktopNavItem to="/blog" text="Blog" />
      <LogInButton />
      <SignUpButton />
      <DesktopNavItem
        to="/backers"
        text={
          <span role="img" aria-label="Sparkle">
            ✨
          </span>
        }
      />
    </>
  );
}

function SignUpButton() {
  const { modalV2 } = useStores();

  function handleSignup() {
    logModalView('/signup-zip');
    modalV2.open(<SignupForm />);
  }

  return (
    <Box px={1} py={2}>
      <ColorfulWallyButton onClick={handleSignup} bgColor={'#000'}>
        <Typography variant="body1">Sign Up</Typography>
      </ColorfulWallyButton>
    </Box>
  );
}

function LogInButton() {
  const { modalV2 } = useStores();

  function handleLogin() {
    logModalView('/login');
    modalV2.open(<LoginForm />);
  }

  return (
    <Box px={1} py={2}>
      <ColorfulWallyButton
        onClick={handleLogin}
        color={'#000'}
        bordercolor={'#000'}
        bgColor={'transparent'}
      >
        <Typography variant="body1">Log In</Typography>
      </ColorfulWallyButton>
    </Box>
  );
}
