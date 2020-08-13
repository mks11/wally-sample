import React from "react";
import { Link } from "react-router-dom";
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from "./MobileStyledComponents";

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
