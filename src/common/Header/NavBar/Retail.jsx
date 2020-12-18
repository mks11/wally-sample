import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import { MobileNavMenu } from './MobileNavComponents';
import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';
import AccountDropdown, {
  AccountDropdownMenuListItem,
  AccountDropdownMenuItem,
} from 'common/Header/NavBar/AccountDropdown';

export const MobileRetailNav = observer(() => {
  const { user } = useStores();
  return user.isRetail ? (
    <>
      <MobileNavMenu>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/retail">Home</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/main">Shop</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </MobileNavMenu>
      <AccountDropdown></AccountDropdown>
      {/* <Cart /> */}
    </>
  ) : null;
});

export const DesktopRetailNav = observer(() => {
  const { user } = useStores();

  return user.isRetail ? (
    <>
      <DesktopNavItem to="/retail" text="Home" />
      <DesktopNavItem to="/main" text="Shop" />
      <AccountDropdown>{/* TODO: ADD LINKS AS NECESSARY */}</AccountDropdown>
    </>
  ) : null;
});
