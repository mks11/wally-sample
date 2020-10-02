import React from 'react';
import { Link as RLink } from 'react-router-dom';
import PropTypes from 'prop-types';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import {
  MobileNavItem,
  MobileNavMenu,
  SignOutButton,
  MobileUserGreeting,
} from './MobileNavComponents';
import {
  DesktopNavItem,
  DesktopDropdownMenu,
} from 'common/Header/NavBar/DesktopNavComponents';

export const MobileRetailNav = observer(() => {
  const { user } = useStores();
  return user.isRetail ? (
    <MobileNavMenu>
      <MobileRetailNavMenu />
    </MobileNavMenu>
  ) : null;
});

export function MobileRetailNavMenu() {
  const { modalV2 } = useStores();

  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/retail" onClick={modalV2.close} hasDivider>
        Home
      </MobileNavItem>
      <MobileNavItem to="/main" onClick={modalV2.close} hasDivider>
        Shop
      </MobileNavItem>
      <SignOutButton />
    </>
  );
}

export const DesktopRetailNav = observer(() => {
  const { user } = useStores();

  return user.isRetail ? (
    <>
      <DesktopNavItem to="/retail" text="Home" />
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopDropdownMenu>
        {/* TODO: ADD LINKS AS NECESSARY */}
      </DesktopDropdownMenu>
    </>
  ) : null;
});

function Link({ children, ...rest }) {
  return (
    <li>
      <RLink {...rest}>
        <MobileNavLinkText>{children}</MobileNavLinkText>
      </RLink>
    </li>
  );
}
