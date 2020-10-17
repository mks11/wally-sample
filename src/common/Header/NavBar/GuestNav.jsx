import React from 'react';
import PropTypes from 'prop-types';

// Hooks
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services
import { logModalView } from 'services/google-analytics';

// npm Package Components
import { Box, Typography } from '@material-ui/core';

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

export const MobileGuestNav = observer(() => {
  const { user } = useStores();

  return !user.user ? (
    <MobileNavMenu>
      <MobileGuestNavMenu />
    </MobileNavMenu>
  ) : null;
});

function MobileGuestNavMenu() {
  const { modalV2 } = useStores();
  const handleClose = () => modalV2.close();
  return (
    <>
      <MobileLogInButton />
      <MobileSignUpButton />
      <MobileNavItem to="/about" onClick={handleClose} hasDivider>
        About
      </MobileNavItem>
      <MobileNavItem to="/howitworks" onClick={handleClose} hasDivider>
        How It Works
      </MobileNavItem>
      <MobileNavItem to="/blog" onClick={handleClose} hasDivider>
        Blog
      </MobileNavItem>
      <MobileNavItem to="/backers" onClick={handleClose}>
        Our Backers
      </MobileNavItem>
      {/* <MobileNavItem to="/help" onClick={handleClose} hasDivider>
        Help
      </MobileNavItem> */}
      {/* <MobileNavItem to="/giftcard" onClick={handleClose}>
        Gift Card
      </MobileNavItem> */}
    </>
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

export const DesktopGuestNav = observer(() => {
  const { user } = useStores();

  return !user.user ? (
    <>
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
  ) : null;
});

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
