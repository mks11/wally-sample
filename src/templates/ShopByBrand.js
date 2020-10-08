import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';
import { withRouter } from 'react-router-dom';
import { Container } from '@material-ui/core';
import axios from 'axios';
import { API_GET_BRAND } from 'config';
import { API_GET_PRODUCTS_MATCHING_FILTERS } from 'config';
import ProductAssortmentDetails from 'common/ProductAssortmentDetails';
import ProductAssortment from 'common/ProductAssortment';

function getBrand(user, brandName) {
  return axios.get(API_GET_BRAND, {
    ...user.getHeaderAuth(),
    data: {
      urlName: brandName,
    },
  });
}

function getProductAssortment(user, brandName) {
  return axios.get(API_GET_PRODUCTS_MATCHING_FILTERS, {
    ...user.getHeaderAuth(),
    data: {
      brandUrlName: brandName,
    },
  });
}

function ShopByBrand({ match }) {
  const { user: userStore, snackbar, loading, product } = useStores();
  const [brandData, setBrandData] = useState({});
  const { brandName = '' } = match.params;

  useEffect(() => {
    async () => {
      try {
        loading.show();
        const [
          { data: brand },
          { data: productAssortmentData },
        ] = await Promise.all([
          getBrand(userStore, brandName),
          getProductAssortment(userStore, brandName),
        ]);

        product.initializeProductAssortment(productAssortmentData);
        setBrandData(brand);
      } catch (e) {
        snackbar.openSnackbar(
          'An error occurred while loading brand data. Brand data is unavailable',
          'error',
        );
      } finally {
        setTimeout(loading.hide(), 300);
      }
    };
  }, []);

  const { name, logo_url, description } = brandData;

  return (
    <Container maxWidth="xl">
      <ProductAssortmentDetails
        title={name}
        image={logo_url}
        description={description}
      />
      <ProductAssortment />
    </Container>
  );
}

export default observer(withRouter(ShopByBrand));
