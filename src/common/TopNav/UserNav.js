import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils";

import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
  MobileUserPackagingBalance,
} from "./MobileStyledComponents";

import {
  DesktopDropdownMenuItem,
  DesktopDropdownMenuLink,
} from "./DesktopNavComponents";

export function MobileUserNav({
  hideNav,
  handleSignout,
  handleSchedulePickup,
  userName,
  userStoreCredit,
}) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li style={{ padding: "15px 0" }}>
        <MobileUserPackagingBalance balance={userStoreCredit} />
      </li>
      <li>
        <Link to="/orders" onClick={hideNav}>
          <MobileNavLinkText>Order History</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/user" onClick={hideNav}>
          <MobileNavLinkText>Account Settings</MobileNavLinkText>
        </Link>
      </li>
      {/* <li><a onClick={this.handleMobileNavInvite}>Refer your friend, get a tote</a></li> */}
      <li>
        <MobileNavButton onClick={handleSchedulePickup}>
          Schedule Pickup
        </MobileNavButton>
      </li>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/latest-news" onClick={hideNav}>
          <MobileNavLinkText>COVID-19</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={hideNav}>
          <MobileNavLinkText>About</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/howitworks" onClick={hideNav}>
          <MobileNavLinkText>How It Works</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/help" onClick={hideNav}>
          <MobileNavLinkText>Help</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={hideNav}>
          <MobileNavLinkText>Blog</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/giftcard" onClick={hideNav}>
          <MobileNavLinkText>Gift Card</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/backers" onClick={hideNav}>
          <MobileNavLinkText>Our Backers</MobileNavLinkText>
        </Link>
      </li>
    </>
  );
}

export function DesktopUserNav({
  balance,
  handleRedeemDeposit,
  handleSchedulePickup,
  handleSignout,
  hideDropdown,
}) {
  return (
    <>
      <DesktopDropdownMenuItem>
        <span className="dropdown-item">
          Packaging Balance ({formatMoney(balance / 100)})
        </span>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/orders">
          Order History
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <a onClick={handleSchedulePickup} className="dropdown-item">
          Schedule Pickup
        </a>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/user">
          Account Settings
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/latest-news">
          COVID-19
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/about">
          About
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/howitworks">
          How It Works
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/help">
          Help
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/blog">
          Blog
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/giftcard">
          Gift Card
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <DesktopDropdownMenuLink onClick={hideDropdown} to="/backers">
          Our Backers
        </DesktopDropdownMenuLink>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <a onClick={handleRedeemDeposit} className="dropdown-item">
          Redeem Deposit
        </a>
      </DesktopDropdownMenuItem>
      <DesktopDropdownMenuItem>
        <a onClick={handleSignout} className="dropdown-item">
          Sign Out
        </a>
      </DesktopDropdownMenuItem>
    </>
  );
}
