import React, { lazy, Suspense, useEffect, useState } from 'react';

import { formatMoney } from 'utils';
import { logPageView } from 'services/google-analytics';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { PRODUCT_BASE_URL } from 'config';
import { useMediaQuery } from 'react-responsive';

// Custom Components
import CartSummary from 'common/CartSummary';
import CheckoutFlowBreadCrumbs from 'common/CheckoutFlowBreadcrumbs';
import EmptyCartMessage from './EmptyCartMessage';
import ImageCarousel from 'common/ImageCarousel';

// Material UI
import { Box, Card, Container, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Styled components
import { PrimaryWallyButtonLink } from 'styled-component-lib/Links';

const ReviewCart = ({ breadcrumbs, location }) => {
  const theme = useTheme();
  const [visibleSlides, setVisibleSlides] = useState(3);
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
    loading: loadingStore,
    product: productStore,
    snackbar: snackbarStore,
    user: userStore,
  } = useStores();

  const { cart } = checkoutStore;
  const [impulseProducts, setImpulseProducts] = useState([]);

  useEffect(() => {
    // Store page view in google analytics
    logPageView(location.pathname);

    if (cart) {
      loadData();
    }
  }, [cart]);

  useEffect(() => {
    if (isXs) {
      setVisibleSlides(1);
    } else if (isSm) {
      setVisibleSlides(1.5);
    } else if (isMd) {
      setVisibleSlides(2);
    } else setVisibleSlides(3);
  }, [isXs, isSm, isMd]);

  const loadData = async () => {
    try {
      loadingStore.show();
      const auth = userStore.user ? userStore.getHeaderAuth() : {};
      const cartId = cart ? cart._id.toString() : undefined;
      const res = await productStore.getImpulseProducts(cartId, auth);
      if (res && res.data) {
        setImpulseProducts(res.data);
      }
    } catch (error) {
      snackbarStore.openSnackbar('Failed to load similar products', 'error');
    } finally {
      loadingStore.hide();
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
    <div className="App">
      <Container maxWidth="xl">
        <Box py={4}>
          <CheckoutFlowBreadCrumbs
            breadcrumbs={breadcrumbs}
            location={location}
          />
          {cart && items.length < 1 ? (
            <Box py={2} px={1}>
              <EmptyCartMessage />
            </Box>
          ) : (
            <Card
              style={{ background: 'rgba(0, 0, 0, 0.05)', marginTop: '32px' }}
            >
              <Box py={2} px={1}>
                <Box>
                  {/* Impulse products */}
                  <Box px={1}>
                    <Typography component="h1" variant="h2" gutterBottom>
                      Need anything else?
                    </Typography>
                  </Box>
                  {impulseProducts.length > 0 ? (
                    <ImageCarousel
                      height={184}
                      numSlides={12}
                      width={384}
                      slides={slides}
                      visibleSlides={visibleSlides}
                    />
                  ) : (
                    <Card style={{ height: '184px' }} />
                  )}
                </Box>
              </Box>
            </Card>
          )}
          <br />

          {/* Cart */}
          {impulseProducts.length ? (
            <Card elevation={2}>
              <Box p={2}>
                <Typography component="h1" variant="h2" gutterBottom>
                  Review your cart
                </Typography>
                <CartSummary />
                <Box display="flex" justifyContent="center" p={2}>
                  <PrimaryWallyButtonLink to="/checkout/shipping">
                    <Typography component="span" variant="h6">
                      Continue To Shipping
                    </Typography>
                  </PrimaryWallyButtonLink>
                </Box>
              </Box>
            </Card>
          ) : (
            <Card style={{ height: '184px' }} elevation={3} />
          )}
        </Box>
      </Container>
    </div>
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
      style={{ height: '98%', margin: '0 8px' }}
    >
      <Box p={2} height="100%">
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
