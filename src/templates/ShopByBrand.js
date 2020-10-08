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
    params: {
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
    async function load() {
      try {
        loading.show();
        const [brand] = await Promise.all([
          getBrand(userStore, brandName),
          // getProductAssortment(userStore, brandName),
        ]);
        console.log(brand);
        // product.initializeProductAssortment(productAssortmentData);
        setBrandData(brand.data);
      } catch (e) {
        snackbar.openSnackbar(
          'An error occurred while loading brand data. Brand data is unavailable',
          'error',
        );
      } finally {
        setTimeout(loading.hide(), 300);
      }
    }
    load();
  }, []);

  const { name, logo_url, description } = brandData;

  return (
    <Container maxWidth="xl">
      {brandData && (
        <ProductAssortmentDetails
          title={name}
          image={logo_url}
          description={description}
        />
      )}
      {/* <ProductAssortment /> */}
    </Container>
  );
}

export default withRouter(observer(ShopByBrand));
