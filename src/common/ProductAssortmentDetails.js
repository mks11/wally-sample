import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';

const Img = styled.img`
  max-width: 350px;
  max-height: 350px;
  width: 100%;
  @media only screen and (min-width: 992px) {
    max-width: 250px;
    max-height: 250px;
  }
`;

function ProductAssortmentDetails({ title, image, description }) {
  return (
    <Box my={4}>
      <Grid container justify="center" spacing={4}>
        <Grid xs={8} sm={4} lg={3} item>
          <Box
            display="flex"
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Img src={image} alt={title} />
          </Box>
        </Grid>
        <Grid xs={12} sm={8} lg={9} item>
          <Typography variant="h1" gutterBottom>
            {title}
          </Typography>
          {description && <Typography gutterBottom> {description} </Typography>}
        </Grid>
      </Grid>
    </Box>
  );
}

ProductAssortmentDetails.propTypes = {
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
};

export default ProductAssortmentDetails;
