import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from 'utils';

// Hooks
import { useStores } from 'hooks/mobx';

// Services
import { logModalView } from 'services/google-analytics';

// npm Package Components
import {
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { IconContext } from 'react-icons';
import { FaRegUserCircle } from 'react-icons/fa';

import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
  MobileUserPackagingBalance,
} from './MobileStyledComponents';

import {
  DesktopNavItem,
  DesktopDropdownMenuItem,
  DesktopDropdownMenuBtn,
} from 'common/Header/NavBar/DesktopNavComponents';
import { ColorfulWallyButton } from 'styled-component-lib/Buttons';

import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';

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
      <li style={{ padding: '15px 0' }}>
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

export function DesktopUserNav({ balance, handleRedeemDeposit }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useStores();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return user.isUser ? (
    <>
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopNavItem to="/blog" text="Blog" />
      <DesktopNavItem to="/help" text="Help" />
      <DesktopNavItem to="/latest-news" text="COVID-19" />
      <DesktopNavItem to="/howitworks" text="How It Works" />
      <Button aria-label="account" disableRipple onClick={handleClick}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <IconContext.Provider value={{ size: '2em' }}>
              <FaRegUserCircle />
            </IconContext.Provider>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="body1" component="span">
                {user.user.name}
              </Typography>
              <ArrowDropDownIcon />
            </Box>
          </Grid>
        </Grid>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <DesktopDropdownMenuItem onClick={handleClose} to="/user">
          Account Settings
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem onClick={handleClose} to="/orders">
          Order History
        </DesktopDropdownMenuItem>
        <SchedulePickupButton onClick={handleClose} />
        <DesktopDropdownMenuItem onClick={handleClose} to="/about">
          About
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem onClick={handleClose} to="/giftcard">
          Gift Card
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem onClick={handleClose} to="/backers">
          Our Backers
        </DesktopDropdownMenuItem>
        {/* <DesktopDropdownMenuItem>
          <a onClick={handleRedeemDeposit} className="dropdown-item">
            Redeem Deposit
          </a>
        </DesktopDropdownMenuItem> */}
        {/* <DesktopDropdownMenuItem>
          <SignOutButton />
        </DesktopDropdownMenuItem> */}
      </Menu>
    </>
  ) : null;
}

function SchedulePickupButton({ onClick }) {
  const { modalV2 } = useStores();
  const schedulePickup = () => {
    logModalView('/schedulePickup');
    onClick();
    modalV2.open(<SchedulePickupForm />);
  };
  return (
    <DesktopDropdownMenuBtn onClick={schedulePickup}>
      Schedule Pickup
    </DesktopDropdownMenuBtn>
  );
}

function SignOutButton() {
  const { checkout, routing, user } = useStores();

  function handleLogout() {
    checkout.cart = null;
    checkout.order = null;
    user.logout();
    routing.push('/');
  }

  return (
    <ColorfulWallyButton
      onClick={handleLogout}
      color={'#000'}
      bordercolor={'#000'}
      bgColor={'transparent'}
    >
      <Typography variant="body1">Sign Out</Typography>
    </ColorfulWallyButton>
  );
}
