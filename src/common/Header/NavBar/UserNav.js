import React, { useEffect, useState } from 'react';
import { formatMoney } from 'utils';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Services
import { logModalView } from 'services/google-analytics';

// npm Package Components
import { Badge, IconButton, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

// Custom Components
import {
  MobileNavItem,
  MobileNavListItem,
  MobileNavMenu,
  SignOutButton,
  MobileUserGreeting,
} from './MobileNavComponents';
import { BackButton } from 'common/ModalNavigation';
import {
  DesktopNavItem,
  DesktopDropdownMenu,
  DesktopDropdownMenuItem,
  DesktopDropdownMenuListItem,
  DesktopDropdownMenuBtn,
} from 'common/Header/NavBar/DesktopNavComponents';
import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';
import RedeemPackagingBalance from 'forms/user-nav/RedeemPackagingBalance';

export const MobileUserNav = observer(() => {
  const { user } = useStores();
  return user.isUser ? (
    <>
      <MobileNavMenu>
        <MobileUserNavMenu />
      </MobileNavMenu>
      <Cart />
    </>
  ) : null;
});

function MobileUserNavMenu() {
  const { modalV2 } = useStores();
  const handleClose = () => modalV2.close();
  return (
    <>
      <MobileUserGreeting />
      <MobileNavItem to="/main" onClick={handleClose} hasDivider>
        Shop
      </MobileNavItem>
      <MobileNavItem to="/blog" onClick={handleClose} hasDivider>
        Blog
      </MobileNavItem>
      <MobileNavItem to="/help" onClick={handleClose} hasDivider>
        Help
      </MobileNavItem>
      <MobileNavItem to="/latest-news" onClick={handleClose} hasDivider>
        COVID-19
      </MobileNavItem>
      <MobileNavItem to="/howitworks" onClick={handleClose} hasDivider>
        How It Works
      </MobileNavItem>
      <MobileNavItem to="/user" onClick={handleClose} hasDivider>
        Account Settings
      </MobileNavItem>
      <MobileNavItem to="/orders" onClick={handleClose} hasDivider>
        Order History
      </MobileNavItem>
      <MobilePackagingBalance />
      <MobileRedeemPackagingBalance />
      {/* <li><a onClick={this.handleMobileNavInvite}>Refer your friend, get a tote</a></li> */}
      <MobileSchedulePickupButton />
      <MobileNavItem to="/about" onClick={handleClose} hasDivider>
        About
      </MobileNavItem>
      <MobileNavItem to="/giftcard" onClick={handleClose} hasDivider>
        Gift Cards
      </MobileNavItem>
      <MobileNavItem to="/backers" onClick={handleClose} hasDivider>
        Our Backers
      </MobileNavItem>
      <SignOutButton />
    </>
  );
}

const MobilePackagingBalance = observer(() => {
  const { user } = useStores();

  if (user.user && typeof user.user.packaging_balance === 'number') {
    const { packaging_balance } = user.user;
    const formattedBalance = formatMoney(packaging_balance / 100);
    return (
      <MobileNavListItem divider>
        <Typography variant="h4" component="span" align="left">
          Packaging Balance ({formattedBalance})
        </Typography>
      </MobileNavListItem>
    );
  }
  return null;
});

function MobileRedeemPackagingBalance() {
  const { modalV2 } = useStores();
  const redeemDeposit = () => {
    logModalView('/redeem-deposit');
    modalV2.open(
      <>
        <BackButton>
          <MobileUserNavMenu />
        </BackButton>
        <RedeemPackagingBalance />
      </>,
    );
  };

  return (
    <MobileNavListItem onClick={redeemDeposit} divider>
      <Typography variant="h4" component="span">
        Redeem Packaging Balance
      </Typography>
    </MobileNavListItem>
  );
}

function MobileSchedulePickupButton() {
  const { modalV2 } = useStores();
  const schedulePickup = () => {
    logModalView('/schedulePickup');
    modalV2.open(
      <>
        <BackButton>
          <MobileUserNavMenu />
        </BackButton>
        <SchedulePickupForm />
      </>,
    );
  };
  return (
    <MobileNavListItem onClick={schedulePickup} divider>
      <Typography variant="h4" component="span">
        Schedule Pickup
      </Typography>
    </MobileNavListItem>
  );
}

const PackagingBalance = observer(() => {
  const { user } = useStores();

  if (user.user && typeof user.user.packaging_balance === 'number') {
    const { packaging_balance } = user.user;
    const formattedBalance = formatMoney(packaging_balance / 100);
    return (
      <DesktopDropdownMenuListItem>
        <Typography
          align="left"
          style={{ width: '100%', padding: '1.25em 2.25em', cursor: 'default' }}
        >
          Packaging Balance {formattedBalance}
        </Typography>
      </DesktopDropdownMenuListItem>
    );
  }

  return null;
});

const Cart = observer(({ onClick }) => {
  const { user, checkout } = useStores();
  const items = checkout.cart ? checkout.cart.cart_items : [];
  const numItems = getNumItems(items);
  const isDisabled = numItems < 1;

  useEffect(() => {
    const getCartData = async () => {
      const auth = user.getHeaderAuth();
      await checkout.getCurrentCart(auth);
    };
    getCartData();
  }, []);
  const handleClick = () => console.log('foo');

  return (
    <IconButton
      aria-label="menu"
      onClick={handleClick}
      disabled={isDisabled}
      style={{ color: isDisabled ? 'rgba(0, 0, 0, 0.5)' : 'inherit' }}
    >
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={numItems}
        color="primary"
      >
        <ShoppingBasketIcon fontSize="large" />
      </Badge>
    </IconButton>
  );

  function getNumItems(items) {
    return items.reduce((acc, item) => (acc += item.customer_quantity), 0);
  }
});

export const DesktopUserNav = observer(() => {
  const { user } = useStores();
  return user.isUser ? (
    <>
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopNavItem to="/blog" text="Blog" />
      <DesktopNavItem to="/help" text="Help" />
      <DesktopNavItem to="/latest-news" text="COVID-19" />
      <DesktopNavItem to="/howitworks" text="How It Works" />
      <DesktopDropdownMenu>
        <DesktopDropdownMenuItem to="/user">
          Account Settings
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/orders">
          Order History
        </DesktopDropdownMenuItem>
        <PackagingBalance />
        <RedeemDepositButton />
        <SchedulePickupButton />
        <DesktopDropdownMenuItem to="/giftcard">
          Gift Cards
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/about">About</DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/backers">
          Our Backers
        </DesktopDropdownMenuItem>
      </DesktopDropdownMenu>
      <Cart />
    </>
  ) : null;
});

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

function RedeemDepositButton({ onClick }) {
  const { modalV2 } = useStores();
  const redeemDeposit = () => {
    logModalView('/redeem-deposit');
    onClick();
    modalV2.open(<RedeemPackagingBalance />);
  };

  return (
    <DesktopDropdownMenuBtn onClick={redeemDeposit}>
      Redeem Packaging Balance
    </DesktopDropdownMenuBtn>
  );
}
