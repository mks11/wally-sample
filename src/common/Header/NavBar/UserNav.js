import React, { useEffect, useState } from 'react';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent, logModalView } from 'services/google-analytics';
import { formatMoney } from 'utils';
import { isMobile } from 'react-device-detect';

// npm Package Components
import {
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Menu,
  Typography,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

// Custom Components
import CarbonBar from 'common/CarbonBar';
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

// Styled Components
import {
  PrimaryWallyButton,
  PrimaryTextButton,
  DangerTextButton,
} from 'styled-component-lib/Buttons';

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

const CartDropdown = observer(({ anchorEl, handleClose }) => {
  const { checkout, modal, product, routing, ui, user } = useStores();
  const { cart } = checkout;

  const handleCheckout = () => {
    logEvent({ category: 'Cart', action: 'ClickCheckout' });
    ui.hideBackdrop();
    handleClose();
    if (user.status) {
      routing.push('/main/similar-products');
    } else {
      modal.toggleModal('login');
    }
  };

  const handleEdit = (data) => {
    logEvent({ category: 'Cart', action: 'ClickEditProduct' });
    handleClose();
    product
      .showModal(
        data.product_id,
        data.customer_quantity,
        user.getDeliveryParams(),
      )
      .then((data) => {
        user.adjustDeliveryTimes(data.delivery_date, checkout.deliveryTimes);
        modal.toggleModal('product');
      });
  };

  const handleDelete = (id) => {
    logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
    handleClose();
    modal.toggleModal('delete', id);
  };

  const getItemsCount = (items) => {
    let count = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      count += items[i].customer_quantity;
    }
    return count;
  };
  const items = cart ? cart.cart_items : [];
  const count = getItemsCount(items);
  const subtotal = cart ? cart.subtotal / 100 : 0;

  return isMobile ? null : (
    <Menu
      id="cart"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <Box p={3}>
        {items && count > 0 ? (
          <>
            <Typography variant="h1">Cart</Typography>
            <Box my={2}>
              <CarbonBar nCartItems={count} />
            </Box>
            <Box mb={2}>
              {items.map((item) => {
                const {
                  customer_quantity,
                  _id,
                  product_id,
                  product_name,
                } = item;
                return (
                  <>
                    <Box key={product_name} my={2}>
                      <Box my={1}>
                        <Typography variant="h6">{product_name}</Typography>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Typography
                              color="textSecondary"
                              component="span"
                              gutterBottom
                            >
                              Quantity: {item.customer_quantity}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <PrimaryTextButton
                              onClick={() =>
                                handleEdit({
                                  product_id: item.product_id,
                                  customer_quantity: item.customer_quantity,
                                })
                              }
                            >
                              <Typography>Edit</Typography>
                            </PrimaryTextButton>
                          </Grid>
                          <Grid item>
                            <DangerTextButton
                              onClick={() =>
                                handleDelete({
                                  product_id: item.product_id,
                                  inventory_id: item._id,
                                })
                              }
                            >
                              <Typography>Remove</Typography>
                            </DangerTextButton>
                          </Grid>
                        </Grid>
                      </Box>

                      <Grid container spacing={2} justify="space-between">
                        <Grid item>
                          <Typography component="span">Subtotal</Typography>
                        </Grid>
                        <Grid item>
                          <Typography component="span">
                            {formatMoney(item.total / 100)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Divider />
                  </>
                );
              })}
              <Box my={2}>
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="h6" component="span">
                    Subtotal
                  </Typography>
                  <Typography variant="h6" component="span">
                    {formatMoney(subtotal)}
                  </Typography>
                </Grid>
              </Box>
            </Box>
            <PrimaryWallyButton onClick={handleCheckout} fullWidth>
              <Typography>Checkout</Typography>
            </PrimaryWallyButton>
          </>
        ) : (
          <span className="px-3">No items in cart</span>
        )}
      </Box>
    </Menu>
  );
});

const Cart = observer(() => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, checkout } = useStores();
  const items = checkout.cart ? checkout.cart.cart_items : [];
  const numItems = getNumItems(items);
  const isDisabled = numItems < 1;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const getCartData = async () => {
      const auth = user.getHeaderAuth();
      await checkout.getCurrentCart(auth);
    };
    getCartData();
  }, []);

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
      <CartDropdown anchorEl={anchorEl} handleClose={handleClose} />
    </>
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
