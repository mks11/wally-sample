import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services
import { logModalView } from 'services/google-analytics';

// Custom Components
import LoginForm from 'forms/authentication/LoginForm';
import SignupForm from 'forms/authentication/SignupForm';

// Styled components
import { MobileNavMenu } from 'common/Header/NavBar/MobileNavComponents';
import AccountDropdown, {
  AccountDropdownMenuItem,
  AccountDropdownMenuListItem,
  AccountDropdownMenuBtn,
} from 'common/Header/NavBar/AccountDropdown';

import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';

// TODO: REFACTOR MOBILE and DESKTOP AS ONE COMPONENT

export const MobileGuestNav = observer(() => {
  const { modalV2, user } = useStores();
  function handleLogin() {
    logModalView('/login');
    modalV2.open(<LoginForm />);
  }

  function handleSignup() {
    logModalView('/signup-zip');
    modalV2.open(<SignupForm />);
  }
  return !user.user ? (
    <>
      <MobileNavMenu>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/about">About</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/blog">Blog</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/giftcard">
            Gift Cards
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </MobileNavMenu>

      <AccountDropdown>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuBtn onClick={handleLogin}>
            Log In
          </AccountDropdownMenuBtn>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuBtn onClick={handleSignup}>
            Sign Up
          </AccountDropdownMenuBtn>
        </AccountDropdownMenuListItem>
      </AccountDropdown>
    </>
  ) : null;
});

export const DesktopGuestNav = observer(() => {
  const { modalV2, user } = useStores();

  function handleLogin() {
    logModalView('/login');
    modalV2.open(<LoginForm />);
  }

  function handleSignup() {
    logModalView('/signup-zip');
    modalV2.open(<SignupForm />);
  }
  return !user.user ? (
    <>
      <DesktopNavItem to="/about" text="About" />
      <DesktopNavItem to="/blog" text="Blog" />
      <DesktopNavItem to="/giftcard" text="Gift Cards" />
      <AccountDropdown>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuBtn onClick={handleLogin}>
            Log In
          </AccountDropdownMenuBtn>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuBtn onClick={handleSignup}>
            Sign Up
          </AccountDropdownMenuBtn>
        </AccountDropdownMenuListItem>
      </AccountDropdown>
    </>
  ) : null;
});
