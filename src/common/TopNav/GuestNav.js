import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Styled components
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
} from "./MobileStyledComponents";
import { DesktopNavLink, DesktopNavLinkText } from "./DesktopNavComponents";

export function MobileGuestNav({ hideNav, handleLogin, handleSignup }) {
  return (
    <>
      <li>
        <MobileNavButton onClick={handleLogin}>Log In</MobileNavButton>
      </li>
      <li>
        <MobileNavButton onClick={handleSignup}>Sign Up</MobileNavButton>
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
        <Link to="/blog" onClick={hideNav}>
          <MobileNavLinkText>Blog</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/backers" onClick={hideNav}>
          <MobileNavLinkText>Our Backers</MobileNavLinkText>
        </Link>
      </li>
      {/* <li>
        <Link to="/help" onClick={hideNav}>
          <MobileNavLinkText>Help</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/giftcard" onClick={hideNav}>
          <MobileNavLinkText>Gift Card</MobileNavLinkText>
        </Link>
      </li> */}
    </>
  );
}

MobileGuestNav.propTypes = {
  hideNav: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleSignup: PropTypes.func.isRequired,
};

export function DesktopGuestNav({ handleLogin, handleSignup, handleBackers }) {
  return (
    <>
      <li>
        <Link className="nav-link aw-nav--link p-0" to="/latest-news">
          <DesktopNavLinkText>COVID-19</DesktopNavLinkText>
        </Link>
      </li>
      <li>
        <Link className="nav-link aw-nav--link p-0" to="/about">
          <DesktopNavLinkText>About</DesktopNavLinkText>
        </Link>
      </li>
      <li>
        <Link className="nav-link aw-nav--link p-0" to="/howitworks">
          <DesktopNavLinkText>How It Works</DesktopNavLinkText>
        </Link>
      </li>
      <li>
        <Link className="nav-link aw-nav--link p-0" to="/blog">
          <DesktopNavLinkText>Blog</DesktopNavLinkText>
        </Link>
      </li>
      <li>
        <button
          onClick={handleLogin}
          className="btn btn-outline-black btn-login text-caps"
        >
          Log in
        </button>
      </li>
      <li>
        <button
          onClick={handleSignup}
          className="btn btn-inline-black btn-sign-up text-caps"
        >
          Sign up
        </button>
      </li>
      <li>
        <button
          onClick={handleBackers}
          className="btn btn-inline-transparent btn-backers"
        >
          <span role="img" aria-label="Sparkle">
            ✨
          </span>
        </button>
      </li>
    </>
  );
}

DesktopGuestNav.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleBackers: PropTypes.func.isRequired,
};
