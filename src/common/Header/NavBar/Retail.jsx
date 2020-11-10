import React from 'react';

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
  const handleClose = () => modalV2.close();

  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/retail" onClick={handleClose} hasDivider>
        Home
      </MobileNavItem>
      <MobileNavItem to="/main" onClick={handleClose} hasDivider>
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
