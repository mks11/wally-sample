import React from "react";
import { Link } from "react-router-dom";

import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from "./MobileStyledComponents";

import {
  DesktopDropdownMenuItem,
  DesktopDropdownMenuLink,
} from "./DesktopNavComponents";

export function MobileAdminNav({ hideNav, handleSignout, userName }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/manage/retail" onClick={hideNav}>
          <MobileNavLinkText>Retail</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shopper" onClick={hideNav}>
          <MobileNavLinkText>Shopper</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/packaging" onClick={hideNav}>
          <MobileNavLinkText>Packing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/delivery" onClick={hideNav}>
          <MobileNavLinkText>Delivery</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/courier-routing" onClick={hideNav}>
          <MobileNavLinkText>Courier Routing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shopping-app-1" onClick={hideNav}>
          <MobileNavLinkText>Shopping App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/orders" onClick={hideNav}>
          <MobileNavLinkText>Packing App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/products" onClick={hideNav}>
          <MobileNavLinkText>Products App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shipping" onClick={hideNav}>
          <MobileNavLinkText>Shipping</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/printing" onClick={hideNav}>
          <MobileNavLinkText>Printing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/blog" onClick={hideNav}>
          <MobileNavLinkText>Manage Blogposts</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
}

export function DesktopAdminNav({ handleSignout, hideDropdown }) {
  return (
    <>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/retail">
          Retail
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/shopper">
          Shopper
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/packaging">
          Packaging
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/delivery">
          Delivery
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink
          onClick={hideDropdown}
          to="/manage/courier-routing"
        >
          Courier Routing
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
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
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/products">
          Products App
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/shipping">
          Shipping
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/printing">
          Printing
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/manage/blog">
          Blog
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <a onClick={handleSignout} className="dropdown-item">
          Sign Out
        </a>
      </DesktopDropdownMenuItem>
    </>
  );
}
