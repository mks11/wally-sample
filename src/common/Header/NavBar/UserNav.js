import React, { useEffect, useState } from 'react';
import { PRODUCT_BASE_URL } from 'config';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent, logModalView } from 'services/google-analytics';
import { formatMoney, getItemsCount } from 'utils';

// npm Package Components
import {
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { AddIcon, CloseIcon, RemoveIcon } from 'Icons';

// Custom Components
import { LazyLoadImage } from 'react-lazy-load-image-component';
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
import LoginForm from 'forms/authentication/LoginForm';
import RemoveItemForm from 'forms/cart/RemoveItem';

// Styled Components
import {
  PrimaryWallyButton,
  PrimaryTextButton,
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
  const { checkout, modalV2, user } = useStores();
  const items = checkout.cart ? checkout.cart.cart_items : [];
  const numItems = getNumItems(items);
  const isDisabled = numItems < 1;

  const handleClick = (event) => {
    modalV2.open(<CartSummary />, 'right');
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
    </>
  );

  function getNumItems(items) {
    return items.reduce((acc, item) => (acc += item.customer_quantity), 0);
  }
});

const CartSummary = observer(() => {
  const { checkout, routing, user, modalV2 } = useStores();
  const { cart } = checkout;
  const items = cart ? cart.cart_items : [];
  const count = getItemsCount(items);
  const subtotal = cart ? cart.subtotal / 100 : 0;

  const handleCheckout = () => {
    logEvent({ category: 'Cart', action: 'ClickCheckout' });
    if (user.status) {
      modalV2.close();
      routing.push('/similar-products');
    } else {
      modalV2.open(<LoginForm />);
    }
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Cart
      </Typography>
      {items && count > 0 ? (
        <>
          <Box mb={2}>
            <CarbonBar nCartItems={count} />
          </Box>
          <Divider />
          <Box my={2}>
            {items.map((item) => (
              <Box key={item.product_name}>
                {/* Cart Item Quantity Management*/}
                <CartItem item={item} />
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <Typography>No items in cart</Typography>
      )}
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
      <Box display="flex" justifyContent="center" py={2}>
        <PrimaryWallyButton disabled={count < 1} onClick={handleCheckout}>
          Proceed to Checkout
        </PrimaryWallyButton>
      </Box>
    </>
  );
});

function CartItem({ item }) {
  const {
    customer_quantity,
    _id,
    inventory_id,
    product,
    product_id,
    product_name,
    unit_type,
  } = item;
  const [quantity, setQuantity] = useState(customer_quantity || 0);
  const { checkout, loading, modalV2, user } = useStores();

  var productImage;
  var brand;

  if (product && product[0]) {
    const { image_refs, vendorFull } = product[0];

    if (image_refs && image_refs[0]) {
      productImage = PRODUCT_BASE_URL + product_id + '/' + image_refs[0];
    }

    if (vendorFull && vendorFull.name) brand = vendorFull.name;
  }

  const handleAddQty = () => {
    setQuantity(quantity + 1);
  };

  const handleRemoveQty = () => {
    setQuantity(quantity - 1);
  };

  const handleUpdateCart = async (items) => {
    const auth = user.getHeaderAuth();
    checkout.editCurrentCart({ items }, auth);
  };

  const handleDelete = (item) => {
    logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
    modalV2.open(
      <RemoveItemForm
        item={item}
        handleReinitializeCartSummary={openCartSummary}
      />,
    );
  };

  function openCartSummary() {
    modalV2.open(<CartSummary />, 'right');
  }

  useEffect(() => {
    handleUpdateCart([
      {
        quantity,
        product_id,
        inventory_id,
        unit_type,
      },
    ]);
  }, [quantity]);

  return (
    <Box>
      {/* Product Image */}
      <Box display="flex">
        <Box p={2} pl={0}>
          {productImage ? (
            <LazyLoadImage
              alt={product_name}
              height={80}
              src={productImage}
              width={80}
            />
          ) : null}
        </Box>
        <Grid container>
          <Grid container alignItems="center" justify="space-between">
            <Grid item md={8}>
              <Typography style={{ fontWeight: 'bold' }}>
                {formatMoney(item.total / 100)}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="remove-item-from-cart"
                onClick={() =>
                  handleDelete({
                    inventoryId: _id,
                    name: product_name,
                    productId: product_id,
                  })
                }
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography>{product_name}</Typography>
            </Grid>
            <Grid item xs={12}>
              {brand && (
                <Typography variant="body2" color="textSecondary">
                  {brand}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconButton
                color="primary"
                disableRipple
                onClick={handleRemoveQty}
                disabled={quantity < 2}
              >
                <RemoveIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography>{quantity}</Typography>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                disableRipple
                onClick={handleAddQty}
                disabled={quantity > 9}
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box py={2}>
        <Divider />
      </Box>
    </Box>
  );
}
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
