import React, { useEffect, useState } from 'react';

// API
import { getVendor } from 'api/vendor';

// Custom Components
import ProductAssortmentDetails from 'common/ProductAssortmentDetails';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

// React Router
import { withRouter } from 'react-router-dom';

// Templates
import ShoppingPage from './ShoppingPage';

function ShopByBrand({ location, match }) {
  const { brandName = '' } = match.params;
  const pathname = location && location.pathname ? location.pathname : '';
  const query = {
    brandUrlName: brandName,
  };

  // Local State
  const [brandData, setBrandData] = useState({
    name: '',
    logo_url: '',
    description: '',
  });

  // MobX State
  const { user: userStore, snackbar } = useStores();

  useEffect(() => {
    async function loadBrandData() {
      try {
        const auth = userStore.getHeaderAuth();
        const brand = await getVendor(brandName, auth);
        if (brand.data) setBrandData(brand.data);
      } catch (e) {
        console.error(e);
        snackbar.openSnackbar('Failed to load brand data.', 'error');
      }
    }

    loadBrandData();
  }, []);

  const { name, logo_url, description } = brandData;

  return (
    <ShoppingPage pathname={pathname} query={query}>
      {brandData && (name || logo_url || description) && (
        <ProductAssortmentDetails
          title={name}
          image={logo_url}
          description={description}
        />
      )}
    </ShoppingPage>
  );
}

export default withRouter(observer(ShopByBrand));
