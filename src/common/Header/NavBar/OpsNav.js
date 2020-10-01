import React from 'react';
import { Link } from 'react-router-dom';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from './MobileNavComponents';
import {
  DesktopNavItem,
  DesktopDropdownMenu,
  DesktopDropdownMenuItem,
} from 'common/Header/NavBar/DesktopNavComponents';

export function MobileOpsNav({ hideNav, handleSignout, userName }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/pick-pack" onClick={hideNav}>
          <MobileNavLinkText>Pick/Pack</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/packaging-returns" onClick={hideNav}>
          <MobileNavLinkText>Packaging Returns</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/packaging-inventory" onClick={hideNav}>
          <MobileNavLinkText>Packaging Inventory</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/runs" onClick={hideNav}>
          <MobileNavLinkText>Manage Copacking Round</MobileNavLinkText>
        </Link>
      </li>
      {/* TODO - ARE THESE STILL USED? */}

      {/* <li>
        <Link to="/manage/shopping-app-1" onClick={hideNav}>
          <MobileNavLinkText>Shopping App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/orders" onClick={hideNav}>
          <MobileNavLinkText>Packing App</MobileNavLinkText>
        </Link>
      </li> */}

      {/* <li>
        <Link to="/manage/co-packing/inbound" onClick={hideNav}>
          <MobileNavLinkText>Inbound Shipments</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/outbound" onClick={hideNav}>
          <MobileNavLinkText>Outbound Shipments</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/runs" onClick={hideNav}>
          <MobileNavLinkText>Co-packing</MobileNavLinkText>
        </Link>
      </li> */}
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
}

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
