import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import { MobileNavMenu } from './MobileNavComponents';
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
