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
} from 'common/Header/NavBar/DesktopNavComponents';

export function MobileAdminNav() {
  const { user } = useStores();
  return user.isAdmin ? (
    <MobileNavMenu>
      <MobileAdminNavMenu />
    </MobileNavMenu>
  ) : null;
}

export function MobileAdminNavMenu() {
  const { modalV2 } = useStores();
  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/manage/retail" onClick={modalV2.close} hasDivider>
        Retail Management
      </MobileNavItem>
      <MobileNavItem
        to="/manage/co-packing/runs"
        onClick={modalV2.close}
        hasDivider
      >
        Copacking
      </MobileNavItem>
      <MobileNavItem to="/pick-pack" onClick={modalV2.close} hasDivider>
        Pick/Pack
      </MobileNavItem>
      <MobileNavItem to="/manage/shopper" onClick={modalV2.close} hasDivider>
        Manage Shoppers
      </MobileNavItem>
      <MobileNavItem to="/manage/packaging" onClick={modalV2.close} hasDivider>
        Manage Packaging
      </MobileNavItem>
      <MobileNavItem to="/manage/delivery" onClick={modalV2.close} hasDivider>
        Manage Deliveries
      </MobileNavItem>
      <MobileNavItem
        to="/manage/courier-routing"
        onClick={modalV2.close}
        hasDivider
      >
        Manage Courier Routes
      </MobileNavItem>
      <MobileNavItem
        to="/manage/shopping-app-1"
        onClick={modalV2.close}
        hasDivider
      >
        Shopping App 1
      </MobileNavItem>
      <MobileNavItem to="/manage/orders" onClick={modalV2.close} hasDivider>
        Packing App
      </MobileNavItem>
      <MobileNavItem to="/manage/products" onClick={modalV2.close} hasDivider>
        Products App
      </MobileNavItem>
      <MobileNavItem to="/manage/shipping" onClick={modalV2.close} hasDivider>
        Shipping
      </MobileNavItem>
      <MobileNavItem to="/manage/printing" onClick={modalV2.close} hasDivider>
        Printing
      </MobileNavItem>
      <MobileNavItem to="/manage/blog" onClick={modalV2.close} hasDivider>
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
        <DesktopDropdownMenuItem to="/manage/shopper">
          Manage Shoppers
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/packaging">
          Manage Packaging
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/delivery">
          Manage Deliveries
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/courier-routing">
          Manage Courier Routes
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/shopping-app-1">
          Shopping App 1
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/orders">
          Packing App
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/products">
          Products App
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/shipping">
          Shipping
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/printing">
          Printing
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/blog">
          Manage Blog Posts
        </DesktopDropdownMenuItem>
      </DesktopDropdownMenu>
    </>
  ) : null;
});
