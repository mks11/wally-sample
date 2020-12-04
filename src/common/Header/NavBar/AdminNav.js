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
import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';
import AccountDropdown, {
  AccountDropdownMenuItem,
  AccountDropdownMenuListItem,
} from 'common/Header/NavBar/AccountDropdown';

export const MobileAdminNav = observer(() => {
  const { user } = useStores();
  return user.isAdmin ? (
    <>
      <MobileNavMenu>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/retail">
            Retail Management
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/co-packing/runs">
            Copacking
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/pick-pack">
            Pick/Pack
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </MobileNavMenu>
      <AccountDropdown></AccountDropdown>
      {/* <Cart /> */}
    </>
  ) : null;
});

export function MobileAdminNavMenu() {
  const { modalV2 } = useStores();
  const handleClose = () => modalV2.close();
  return (
    <>
      <MobileUserGreeting />
      {/* <MobileNavItem to="/manage/shopper" onClick={handleClose} hasDivider>
        Manage Shoppers
      </MobileNavItem>
      <MobileNavItem to="/manage/packaging" onClick={handleClose} hasDivider>
        Manage Packaging
      </MobileNavItem>
      <MobileNavItem to="/manage/delivery" onClick={handleClose} hasDivider>
        Manage Deliveries
      </MobileNavItem>
      <MobileNavItem
        to="/manage/courier-routing"
        onClick={handleClose}
        hasDivider
      >
        Manage Courier Routes
      </MobileNavItem>
      <MobileNavItem
        to="/manage/shopping-app-1"
        onClick={handleClose}
        hasDivider
      >
        Shopping App 1
      </MobileNavItem>
      <MobileNavItem to="/manage/orders" onClick={handleClose} hasDivider>
        Packing App
      </MobileNavItem>
      <MobileNavItem to="/manage/products" onClick={handleClose} hasDivider>
        Products App
      </MobileNavItem>
      <MobileNavItem to="/manage/shipping" onClick={handleClose} hasDivider>
        Shipping
      </MobileNavItem>
      <MobileNavItem to="/manage/printing" onClick={handleClose} hasDivider>
        Printing
      </MobileNavItem>
      <MobileNavItem to="/manage/blog" onClick={handleClose} hasDivider>
        Manage Blog Posts
      </MobileNavItem> */}
      <SignOutButton />
    </>
  );
}

export const DesktopAdminNav = observer(() => {
  const { user } = useStores();

  return user.isAdmin ? (
    <>
      <DesktopNavItem to="/manage/retail" text="Retail Management" />
      <DesktopNavItem to="/manage/co-packing/runs" text="Copacking" />
      <DesktopNavItem to="/pick-pack" text="Pick/Pack" />
      <AccountDropdown>
        {/* <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/shopper">
            Manage Shoppers
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/packaging">
            Manage Packaging
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/delivery">
            Manage Deliveries
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/courier-routing">
            Manage Courier Routes
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/shopping-app-1">
            Shopping App 1
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/orders">
            Packing App
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/products">
            Products App
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/shipping">
            Shipping
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/printing">
            Printing
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/blog">
            Manage Blog Posts
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem> */}
      </AccountDropdown>
    </>
  ) : null;
});
