import React, { useEffect, lazy, Suspense } from 'react';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent, logModalView } from 'services/google-analytics';
import { formatMoney } from 'utils';

// npm Package Components
import { Box, Badge, IconButton, Typography } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

// Custom Components
import { MobileNavMenu } from './MobileNavComponents';
import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';
import AccountDropdown, {
  AccountDropdownMenuItem,
  AccountDropdownMenuListItem,
  AccountDropdownMenuBtn,
} from 'common/Header/NavBar/AccountDropdown';
import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';
import RedeemPackagingBalance from 'forms/user-nav/RedeemPackagingBalance';

// Styled components
import { PrimaryContainedLink } from 'styled-component-lib/Links';

export const MobileUserNav = observer(() => {
  const { user } = useStores();
  return user.isUser ? (
    <>
      <MobileNavMenu>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/main">Shop</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/giftcard">
            Gift Cards
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/help">Help</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/about">About</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/blog">Blog</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </MobileNavMenu>
      <AccountDropdown>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/user">Account</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/orders">
            Order History
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <PackagingBalance />
        <RedeemDepositButton />
        <SchedulePickupButton />
      </AccountDropdown>
      <Cart />
    </>
  ) : null;
});

const PackagingBalance = observer(() => {
  const { user } = useStores();

  if (user.user && typeof user.user.packaging_balance === 'number') {
    const { packaging_balance } = user.user;
    const formattedBalance = formatMoney(packaging_balance / 100);
    return (
      <AccountDropdownMenuListItem>
        <Typography
          align="left"
          style={{ width: '100%', padding: '1em 1.5em', cursor: 'default' }}
        >
          Packaging Balance {formattedBalance}
        </Typography>
      </AccountDropdownMenuListItem>
    );
  }

  return null;
});

const CartSummary = lazy(() => import('common/CartSummary'));

const Cart = observer(() => {
  const { checkout, modalV2, user: userStore } = useStores();
  const { user, token } = userStore;
  const items = checkout.cart ? checkout.cart.cart_items : [];
  const numItems = getNumItems(items);
  const isDisabled = numItems < 1;

  const SuspenseFallback = () => (
    <>
      <Typography variant="h1" gutterBottom>
        Cart
      </Typography>
      <Typography gutterBottom>Loading...</Typography>
    </>
  );

  const handleClick = () => {
    modalV2.open(
      <>
        <Typography variant="h1" gutterBottom>
          Cart
        </Typography>
        <Suspense fallback={SuspenseFallback()}>
          <CartSummary />
        </Suspense>
        <ContinueToCheckout />
      </>,
      'right',
    );
  };

  useEffect(() => {
    const loadCart = async () => {
      const auth = userStore.getHeaderAuth();
      await checkout.getCurrentCart(auth);
    };
    if (user && token) {
      loadCart();
    }
  }, [user, token]);

  return (
    <>
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
    </>
  );

  function getNumItems(items) {
    return items.reduce((acc, item) => (acc += item.customer_quantity), 0);
  }
});

export const ContinueToCheckout = () => {
  const { modalV2 } = useStores();
  const handleCheckout = () => {
    logEvent({ category: 'Checkout', action: 'Continue To Checkout' });
    modalV2.close();
  };

  return (
    <Box display="flex" justifyContent="center" py={2}>
      <PrimaryContainedLink to="/checkout/cart" onClick={handleCheckout}>
        <Typography component="span" variant="h6">
          Continue To Checkout
        </Typography>
      </PrimaryContainedLink>
    </Box>
  );
};

export const DesktopUserNav = observer(() => {
  const { user } = useStores();
  return user.isUser ? (
    <>
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopNavItem to="/giftcard" text="Gift Cards" />
      <DesktopNavItem to="/about" text="About" />
      <DesktopNavItem to="/blog" text="Blog" />
      <DesktopNavItem to="/help" text="Help" />
      <AccountDropdown>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/user">Account</AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/orders">
            Order History
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <PackagingBalance />
        <RedeemDepositButton />
        <SchedulePickupButton />
      </AccountDropdown>
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
    <AccountDropdownMenuListItem>
      <AccountDropdownMenuBtn onClick={schedulePickup}>
        Schedule Pickup
      </AccountDropdownMenuBtn>
    </AccountDropdownMenuListItem>
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
    <AccountDropdownMenuListItem>
      <AccountDropdownMenuBtn onClick={redeemDeposit}>
        Redeem Packaging Balance
      </AccountDropdownMenuBtn>
    </AccountDropdownMenuListItem>
  );
}
