import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useStores } from 'hooks/mobx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { PRODUCT_BASE_URL } from 'config';
import { formatMoney } from 'utils';
import styled from 'styled-components';

const ProductModal = lazy(() => import('modals/ProductModalV2'));
function ProductList({ isLoading, products }) {
  const noProductsAvailable = () => {
    return products.every((product) => {
      const { image_refs, name, product_id, vendorFull, inventory } = product;
      return (
        !image_refs.length ||
        !name ||
        !product_id ||
        !vendorFull ||
        !inventory.length
      );
    });
  };

  return (
    <Box py={2}>
      {noProductsAvailable() ? (
        <Box display="flex" justifyContent="center">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Typography variant="h2">No products available</Typography>
          )}
        </Box>
      ) : (
        <Grid container spacing={2}>
          {products.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </Grid>
      )}
    </Box>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
};

export default ProductList;

const ProductCardWrapper = styled(Card)`
  border: 1px solid transparent;
  transition: all 0.15s ease-in-out;
  &:hover {
    border-color: ${(props) => props.color};
    color: ${(props) => props.color};
    transform: scale(1.0125);
    box-shadow: 0 5px 9px -8px black;
  }
`;

function ProductCard({ product }) {
  const theme = useTheme();
  const { modalV2, product: productStore } = useStores();
  const { image_refs, name, product_id, vendorFull, inventory } = product;

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

  const SKU = inventory[0];

  return !image_refs.length ||
    !name ||
    !product_id ||
    !vendorFull ||
    !inventory.length ? null : (
    <Grid
      item
      xs={6}
      md={4}
      sm={4}
      lg={3}
      onClick={() => handleProductClick(product_id)}
    >
      <ProductCardWrapper color={theme.palette.primary.main}>
        <CardContent>
          <Box mb={2}>
            <LazyLoadImage
              alt={name}
              src={`${PRODUCT_BASE_URL}${product_id}/${image_refs[0]}`}
              style={{
                maxHeight: '250px',
                maxWidth: '250px',
                width: '100%',
              }}
            />
          </Box>
          <Typography variant="body2" gutterBottom>
            {vendorFull.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {name}
          </Typography>
          <Typography
            style={
              isSoldOut()
                ? {
                    textDecoration: 'line-through',
                  }
                : undefined
            }
            variant="body2"
            component="span"
          >
            {formatMoney(SKU.price / 100)}
          </Typography>
          {isSoldOut() ? (
            <Typography variant="body2" component="span">
              {' '}
              Sold Out
            </Typography>
          ) : null}
        </CardContent>
      </ProductCardWrapper>
    </Grid>
  );

  function isSoldOut() {
    if (SKU.current_inventory < 1) return true;
    return false;
  }
}
