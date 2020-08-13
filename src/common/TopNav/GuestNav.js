import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Styled components
import { MobileNavLink, MobileNavButton } from "./MobileStyledComponents";
import { DesktopNavLink, DesktopNavLinkText } from "./DesktopNavComponents";

export function MobileGuestNav({ hideNav, handleLogin, handleSignup }) {
  return (
    <>
      <li>
        <MobileNavButton onClick={handleLogin} text="Log In" />
      </li>
      <li>
        <MobileNavButton onClick={handleSignup} text="Sign Up" />
      </li>
      <li>
        <Link to="/backers" onClick={hideNav}>
          <MobileNavLink>Our Backers</MobileNavLink>
        </Link>
      </li>
      <li>
        <Link to="/latest-news" onClick={hideNav}>
          <MobileNavLink>COVID-19</MobileNavLink>
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={hideNav}>
          <MobileNavLink>About</MobileNavLink>
        </Link>
      </li>
      <li>
        <Link to="/howitworks" onClick={hideNav}>
          <MobileNavLink>How It Works</MobileNavLink>
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={hideNav}>
          <MobileNavLink>Blog</MobileNavLink>
        </Link>
      </li>
      {/* <li>
        <Link to="/help" onClick={hideNav}>
          <MobileNavLink>Help</MobileNavLink>
        </Link>
      </li>
      <li>
        <Link to="/giftcard" onClick={hideNav}>
          <MobileNavLink>Gift Card</MobileNavLink>
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
          ✨
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
