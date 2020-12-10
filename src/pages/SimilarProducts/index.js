import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { logPageView } from 'services/google-analytics';
import { getItemsCount } from 'utils';

// Custom Components
import CarbonBar from 'common/CarbonBar';
import CheckoutFlowBreadCrumbs from 'common/CheckoutFlowBreadcrumbs';
import Product from '../Mainpage/Product';
import EmptyCartMessage from './EmptyCartMessage';

// Material UI
import { Box, Container } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

const SimilarProducts = ({ breadcrumbs, location }) => {
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

  const loadData = async () => {
    try {
      loadingStore.show();
      const auth = userStore.user ? userStore.getHeaderAuth() : {};
      const res = await productStore.getImpulseProducts(auth);
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
  const numCartItems = getItemsCount(items);

  return (
    <div className="App">
      <Container maxWidth="xl">
        <Box py={4}>
          <CheckoutFlowBreadCrumbs
            breadcrumbs={breadcrumbs}
            location={location}
          />
          {cart && items.length < 1 ? (
            <EmptyCartMessage />
          ) : (
            <>
              <div className="row justify-content-md-center mt-2">
                <div className="col col-lg-9">
                  <h1>Customers also bought:</h1>
                </div>
                <hr />
                <div className="col col-lg-3 similar-products-checkout">
                  <h3 className="text-right">
                    <Link to="/checkout" className="color-purple">
                      Continue To Checkout
                    </Link>
                  </h3>
                </div>
                <br />
              </div>
              <CarbonBar nCartItems={numCartItems} />
              <div className="col-12">
                <div className="row">
                  {impulseProducts.length > 0
                    ? impulseProducts.map((product) => (
                        <Product key={product.product_id} product={product} />
                      ))
                    : null}
                </div>
              </div>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default observer(SimilarProducts);
