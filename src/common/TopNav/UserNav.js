import React from "react";
import { Link } from "react-router-dom";
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
  MobileUserPackagingBalance,
} from "./MobileStyledComponents";

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

export function DesktopUserNav() {}
