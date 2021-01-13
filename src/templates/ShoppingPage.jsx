import React, { useEffect } from 'react';

// API
import { getProductAssortment } from 'api/product';

// Cookies
import { useCookies } from 'react-cookie';

// Custom Components
import ProductAssortment from 'common/ProductAssortment';

// Material UI
import { Container } from '@material-ui/core';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// React Router
import { withRouter } from 'react-router-dom';

function ShoppingPage({ children, pathname, query }) {
  const cookieName = 'productAssortmentPrefs';
  const [cookies, setCookie] = useCookies([cookieName]);
  const productAssortmentPrefs = cookies[cookieName];

  // MobX State
  const { user: userStore, snackbar, loading, product } = useStores();

  useEffect(() => {
    if (
      !productAssortmentPrefs ||
      (productAssortmentPrefs && productAssortmentPrefs.pathname !== pathname)
    ) {
      initializeProductAssortmentPrefs(cookieName, pathname, setCookie);
    }
  }, [pathname, productAssortmentPrefs]);

  useEffect(() => {
    async function loadProductAssortment() {
      try {
        const auth = userStore.getHeaderAuth();
        loading.show();
        const productAssortment = await getProductAssortment(query, auth);
        product.initializeProductAssortment(productAssortment.data);
      } catch (e) {
        console.error(e);
        snackbar.openSnackbar('Failed to load product assortment.', 'error');
      } finally {
        setTimeout(() => loading.hide(), 300);
      }
    }

    loadProductAssortment();
  }, []);

  return (
    <Container maxWidth="xl">
      {children}
      <ProductAssortment />
    </Container>
  );
}

export default withRouter(observer(ShoppingPage));

function initializeProductAssortmentPrefs(cookieName, pathname, setCookie) {
  const initialPrefs = {
    // Store path that the preferences are associated with so they can be reset
    pathname,
    sortingOption: 'alphabetical',
    // TODO: Extend with filters in future
  };

  setCookie(cookieName, initialPrefs, { path: '/' });
}
