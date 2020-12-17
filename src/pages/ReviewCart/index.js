import React, { lazy, Suspense, useEffect, useState } from 'react';

import { formatMoney } from 'utils';
import { logPageView } from 'services/google-analytics';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { PRODUCT_BASE_URL } from 'config';
import { useMediaQuery } from 'react-responsive';

// Custom Components
import CartSummary from 'common/CartSummary';
import CheckoutFlowBreadCrumbs from 'common/CheckoutFlowBreadcrumbs';

import ImageCarousel from 'common/ImageCarousel';

// Material UI
import { Box, Card, Container, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Styled components
import {
  InternalWallyLink,
  PrimaryContainedLink,
} from 'styled-component-lib/Links';

const ReviewCart = ({ breadcrumbs, location }) => {
  const theme = useTheme();
  const [visibleSlides, setVisibleSlides] = useState(2);
  const isXs = useMediaQuery({
    query: `(max-width: ${theme.breakpoints.values.sm}px)`,
  });
  const isSm = useMediaQuery({
    query: `(max-width: ${theme.breakpoints.values.md - 1}px)`,
  });
  const isMd = useMediaQuery({
    query: `(max-width: ${theme.breakpoints.values.lg - 1}px)`,
  });

  const {
    checkout: checkoutStore,
    product: productStore,
    snackbar: snackbarStore,
    user: userStore,
  } = useStores();

  const { cart } = checkoutStore;
  const [impulseProducts, setImpulseProducts] = useState([]);

  useEffect(() => {
    // Store page view in google analytics
    logPageView(location.pathname);

    if (cart && cart.cart_items && cart.cart_items.length) {
      loadData();
    }
  }, [cart]);

  useEffect(() => {
    if (isXs) {
      setVisibleSlides(1);
    } else if (isSm) {
      setVisibleSlides(1.5);
    } else setVisibleSlides(2);
  }, [isXs, isSm, isMd]);

  const loadData = async () => {
    try {
      const auth = userStore.user ? userStore.getHeaderAuth() : {};
      const cartId = cart ? cart._id.toString() : undefined;
      const res = await productStore.getImpulseProducts(cartId, auth);
      if (res && res.data) {
        setImpulseProducts(res.data);
      }
    } catch (error) {
      snackbarStore.openSnackbar('Failed to load similar products', 'error');
    }
  };

  const items = cart ? cart.cart_items : [];
  const slides = impulseProducts
    ? impulseProducts
        .filter((p) => !p.out_of_stock)
        .map((product) => (
          <ImpulseProduct key={product.product_id} product={product} />
        ))
    : [];

  return (
    <Container maxWidth="md">
      <CheckoutFlowBreadCrumbs breadcrumbs={breadcrumbs} location={location} />
      <Card style={{ background: 'rgba(0, 0, 0, 0.05)' }}>
        <Box p={2}>
          <Card elevation={0}>
            <Box p={2}>
              {cart && items.length < 1 ? (
                <>
                  <Typography variant="h1">Your cart is empty.</Typography>
                  <Typography variant="body1">
                    Why don’t you{' '}
                    <InternalWallyLink to="/main">
                      head back to our shop
                    </InternalWallyLink>{' '}
                    so we can fix that?
                  </Typography>
                </>
              ) : (
                <>
                  <Typography component="h1" variant="h2" gutterBottom>
                    Need anything else?
                  </Typography>
                  {impulseProducts.length > 0 ? (
                    <ImageCarousel
                      keyName="impulse-products"
                      height={250}
                      numSlides={12}
                      width={384}
                      slides={slides}
                      visibleSlides={visibleSlides}
                    />
                  ) : (
                    <Card style={{ height: '184px' }} />
                  )}
                </>
              )}
            </Box>
          </Card>

          {/* Cart */}
          {cart && items.length ? (
            <Card elevation={0} style={{ marginTop: '1rem' }}>
              <Box p={2}>
                <Typography component="h1" variant="h2" gutterBottom>
                  Review your cart
                </Typography>
                <CartSummary />
                {impulseProducts.length ? (
                  <Box display="flex" justifyContent="center" pt={2}>
                    <PrimaryContainedLink to="/checkout/shipping">
                      <Typography component="span" variant="h6">
                        Continue To Shipping
                      </Typography>
                    </PrimaryContainedLink>
                  </Box>
                ) : null}
              </Box>
            </Card>
          ) : null}
        </Box>
      </Card>
    </Container>
  );
};

export default observer(ReviewCart);

const ProductModal = lazy(() => import('modals/ProductModalV2'));

function ImpulseProduct({ product }) {
  const { modalV2, product: productStore } = useStores();
  const producer = product.producer || null;
  const price = product.product_price / 100;

  const handleProductClick = async (product_id) => {
    try {
      await productStore.showModal(product_id, null);
      modalV2.open(
        <Suspense
          fallback={<Typography variant="h1">Loading product...</Typography>}
        >
          <ProductModal />
        </Suspense>,
        'right',
        'md',
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card
      onClick={() => handleProductClick(product.product_id)}
      style={{ cursor: 'pointer', height: '98%', margin: '0 4px' }}
    >
      <Box p={1} height="100%" display="flex" alignItems="center">
        <Grid
          container
          alignItems="center"
          spacing={2}
          style={{ height: '100%' }}
        >
          <Grid item xs={4}>
            <LazyLoadImage
              alt={product.product_name || product.name}
              src={`${PRODUCT_BASE_URL}${product.product_id}/${product.image_refs[0]}`}
              height="100%"
              width="100%"
            />
          </Grid>
          {product.product_name && (
            <Grid item xs={8}>
              <Typography>{product.product_name}</Typography>
              {producer && (
                <Typography variant="body2" color="textSecondary">
                  {producer}
                </Typography>
              )}
              {product.packaging_type && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Packed in {product.packaging_type}
                </Typography>
              )}
              <Typography>{formatMoney(price)}</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Card>
  );
}
