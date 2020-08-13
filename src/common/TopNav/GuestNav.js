import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// Styled components
import { MobileNavLink, MobileNavButton } from "./MobileStyledComponents";

export function MobileGuestNav({ hideNav, logIn, signUp }) {
  return (
    <>
      <li>
        <MobileNavButton onClick={logIn} text="Log In" />
      </li>
      <li>
        <MobileNavButton onClick={signUp} text="Sign Up" />
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
  logIn: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
};

function DesktopGuestNav() {}
