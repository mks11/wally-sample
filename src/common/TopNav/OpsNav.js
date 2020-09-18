import React from 'react';
import { Link } from 'react-router-dom';
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from './MobileStyledComponents';
import {
  DesktopDropdownMenuItem,
  DesktopDropdownMenuLink,
} from './DesktopNavComponents';

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

export function DesktopOpsNav({ hideDropdown, handleSignout }) {
  return (
    <>
      {/* <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/shopping-app-1"
        >
          Shopping App
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/orders">
          Packaging App
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem> */}
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/pick-pack">
          Pick/Pack
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/packaging-returns">
          Packaging Returns
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/packaging-inventory"
        >
          Packaging Inventory
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/co-packing/runs"
        >
          Manage Copacking Round
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      {/* <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/co-packing/inbound"
        >
          Inbound Shipment
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/co-packing/outbound"
        >
          Outbound Shipment
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/co-packing/runs"
        >
          Co-packing
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem> */}
      <DesktopDropdownMenuItem>
        <a onClick={handleSignout} className="dropdown-item">
          Sign Out
        </a>
      </DesktopDropdownMenuItem>
    </>
  );
}
