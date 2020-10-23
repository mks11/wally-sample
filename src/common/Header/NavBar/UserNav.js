import React, { useEffect } from 'react';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logModalView } from 'services/google-analytics';
import { formatMoney } from 'utils';

// npm Package Components
import { Badge, Box, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { Link } from 'react-router-dom';

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
      <MobileNavItem to="/user" onClick={handleClose} hasDivider>
        Account Settings
      </MobileNavItem>
      <MobileNavItem to="/orders" onClick={handleClose} hasDivider>
        Order History
      </MobileNavItem>
      <MobilePackagingBalance />
      <MobileRedeemPackagingBalance />
      <MobileSchedulePickupButton />
      <MobileNavItem to="/giftcard" onClick={handleClose} hasDivider>
        Gift Cards
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
          style={{ width: '100%', padding: '1em 1.5em', cursor: 'default' }}
        >
          Packaging Balance {formattedBalance}
        </Typography>
      </DesktopDropdownMenuListItem>
    );
  }

  return null;
});

const Cart = observer(() => {
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

  return (
    <Box display="flex" alignItems="center">
      <Link
        alt="Cart"
        aria-label="cart"
        disabled={isDisabled}
        style={{ color: isDisabled ? 'rgba(0, 0, 0, 0.5)' : 'inherit' }}
        to="/cart"
      >
        <Badge
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={numItems}
          color="primary"
        >
          <ShoppingBasketIcon fontSize="large" />
        </Badge>
      </Link>
    </Box>
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
      <DesktopDropdownMenu>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/user">
            Account Settings
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/orders">
            Order History
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
        <PackagingBalance />
        <RedeemDepositButton />
        <SchedulePickupButton />
        <DesktopDropdownMenuListItem>
          <DesktopDropdownMenuItem to="/giftcard">
            Gift Cards
          </DesktopDropdownMenuItem>
        </DesktopDropdownMenuListItem>
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
    <DesktopDropdownMenuListItem>
      <DesktopDropdownMenuBtn onClick={schedulePickup}>
        Schedule Pickup
      </DesktopDropdownMenuBtn>
    </DesktopDropdownMenuListItem>
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
    <DesktopDropdownMenuListItem>
      <DesktopDropdownMenuBtn onClick={redeemDeposit}>
        Redeem Packaging Balance
      </DesktopDropdownMenuBtn>
    </DesktopDropdownMenuListItem>
  );
}
