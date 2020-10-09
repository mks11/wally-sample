import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useStores } from 'hooks/mobx';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { PRODUCT_BASE_URL } from 'config';
import { formatMoney } from 'utils';

function ProductList({ products }) {
  return (
    <Box py={2}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </Grid>
    </Box>
  );
}

ProductList.propTypes = {
  products: PropTypes.array,
};

export default ProductList;

function ProductCard({ product }) {
  const { modal, product: productStore } = useStores();
  const { image_refs, name, product_id, vendorFull, inventory } = product;
  const openProductModal = () => {
    productStore.showModal(product_id, null).then(() => {
      modal.toggleModal('product');
    });
  };
  return (
    <Grid item xs={6} md={4} sm={4} lg={3} onClick={openProductModal}>
      <Card>
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
              !inventory[0].current_inventory && {
                textDecoration: 'line-through',
              }
            }
            variant="body2"
            component="span"
          >
            {formatMoney(inventory[0].price)}
          </Typography>
          <Typography variant="body2" component="span">
            {!inventory[0].current_inventory && ' Sold Out'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
