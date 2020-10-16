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
  DesktopDropdownMenuItem,
  DesktopDropdownMenuListItem,
} from 'common/Header/NavBar/DesktopNavComponents';

export const MobileAdminNav = observer(() => {
  const { user } = useStores();
  return user.isAdmin ? (
    <MobileNavMenu>
      <MobileAdminNavMenu />
    </MobileNavMenu>
  ) : null;
});

export function MobileAdminNavMenu() {
  const { modalV2 } = useStores();
  const handleClose = () => modalV2.close();
  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/manage/retail" onClick={handleClose} hasDivider>
        Retail Management
      </MobileNavItem>
      <MobileNavItem
        to="/manage/co-packing/runs"
        onClick={handleClose}
        hasDivider
      >
        Copacking
      </MobileNavItem>
      <MobileNavItem to="/pick-pack" onClick={handleClose} hasDivider>
        Pick/Pack
      </MobileNavItem>
      <MobileNavItem to="/manage/shopper" onClick={handleClose} hasDivider>
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
      </MobileNavItem>
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
      <DesktopDropdownMenu>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/shopper">
            Manage Shoppers
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/packaging">
            Manage Packaging
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/delivery">
            Manage Deliveries
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/courier-routing">
            Manage Courier Routes
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/shopping-app-1">
            Shopping App 1
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/orders">
            Packing App
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/products">
            Products App
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/shipping">
            Shipping
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/printing">
            Printing
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/manage/blog">
            Manage Blog Posts
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
      </DesktopDropdownMenu>
    </>
  ) : null;
});
