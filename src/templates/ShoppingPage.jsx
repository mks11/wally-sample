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
import { initialProductAssortmentPrefs } from 'stores/ProductStore';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// React Router
import { withRouter } from 'react-router-dom';

export const cookieName = 'productAssortmentPrefs';

function ShoppingPage({ children, pathname, query }) {
  const [cookies, setCookie] = useCookies([cookieName]);
  const productAssortmentPrefs = cookies[cookieName];

  // MobX State
  const {
    user: userStore,
    snackbar,
    loading,
    product: productStore,
  } = useStores();

  useEffect(() => {
    // TODO: Remove when finished with this feature
    console.log(productAssortmentPrefs);

    let prefs = initialProductAssortmentPrefs;
    // If cookie doesn't exist yet or page has changed, initialize sort and filter options
    if (
      !productAssortmentPrefs ||
      (productAssortmentPrefs && productAssortmentPrefs.pathname !== pathname)
    ) {
      initializeProductAssortmentPrefs(cookieName, pathname, setCookie);
    } else {
      // If cookie exists and page hasn't changed, maintain same sort and filter options
      prefs = productAssortmentPrefs;
    }

    productStore.setProductAssortmentPrefs(prefs);
  }, [pathname, productAssortmentPrefs]);

  useEffect(() => {
    async function loadProductAssortment() {
      try {
        const auth = userStore.getHeaderAuth();
        loading.show();
        const productAssortment = await getProductAssortment(query, auth);
        productStore.initializeProductAssortment(productAssortment.data);
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
  const prefs = {
    ...initialProductAssortmentPrefs,
    // So preferences can be reset when landing on a diff page
    pathname,
  };

  setCookie(cookieName, prefs, { path: '/' });
}
