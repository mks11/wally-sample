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

export function MobileOpsNav() {
  const { user } = useStores();
  return user.isOps || user.isOpsLead ? (
    <MobileNavMenu>
      <MobileOpsNavMenu />
    </MobileNavMenu>
  ) : null;
}

export const MobileOpsNavMenu = observer(() => {
  const { user, modalV2 } = useStores();
  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/pick-pack" onClick={modalV2.close} hasDivider>
        Pick/Pack
      </MobileNavItem>
      <MobileNavItem to="/packaging-returns" onClick={modalV2.close} hasDivider>
        Packaging Returns
      </MobileNavItem>
      <MobileNavItem
        to="/manage/co-packing/runs"
        onClick={modalV2.close}
        hasDivider
      >
        Copacking
      </MobileNavItem>
      <MobileNavItem
        to="/packaging-inventory"
        onClick={modalV2.close}
        hasDivider
      >
        Packaging Inventory
      </MobileNavItem>
      {user && user.isOpsLead && (
        <MobileNavItem
          to="/manage/co-packing/inbound"
          onClick={modalV2.close}
          hasDivider
        >
          Inbound Shipments
        </MobileNavItem>
      )}
      {user && user.isOpsLead && (
        <MobileNavItem
          to="/manage/co-packing/outbound"
          onClick={modalV2.close}
          hasDivider
        >
          Outbound Shipments
        </MobileNavItem>
      )}
      {/* TODO - ARE THESE STILL USED? */}
      {/* <MobileNavItem to="/manage/shopping-app-1" onClick={modalV2.close} hasDivider>
        Shopping App
      </MobileNavItem> */}
      {/* <MobileNavItem to="/manage/orders" onClick={modalV2.close} hasDivider>
        Packing App
      </MobileNavItem> */}

      <SignOutButton />
    </>
  );
});

export const DesktopOpsNav = observer(() => {
  const { user } = useStores();

  return user.isOps || user.isOpsLead ? (
    <>
      <DesktopNavItem to="/pick-pack" text="Pick/Pack" />
      <DesktopNavItem to="/packaging-returns" text="Packaging Returns" />
      <DesktopNavItem to="/manage/co-packing/runs" text="Copacking" />
      <DesktopDropdownMenu>
        <DesktopDropdownMenuItem to="/packaging-inventory">
          Packaging Inventory
        </DesktopDropdownMenuItem>
        {user.isOpsLead && (
          <DesktopDropdownMenuItem to="/manage/co-packing/inbound">
            Inbound Shipments
          </DesktopDropdownMenuItem>
        )}
        {user.isOpsLead && (
          <DesktopDropdownMenuItem to="/manage/co-packing/outbound">
            Outbound Shipments
          </DesktopDropdownMenuItem>
        )}

        {/* Deprecated */}

        {/* <DesktopDropdownMenuItem to="/manage/shopping-app-1">
          Shopping App
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/orders">
          Packaging App
        </DesktopDropdownMenuItem> */}
      </DesktopDropdownMenu>
    </>
  ) : null;
});
