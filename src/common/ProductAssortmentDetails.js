import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Grid } from '@material-ui/core';
import styled from 'styled-components';

const Img = styled.img`
  max-width: 250px;
  max-height: 250px;
  width: 100%;
`;

function ProductAssortmentDetails({ title, image, description }) {
  return (
    <Box p={2}>
      <Typography variant="h1" gutterBottom>
        {title}
      </Typography>
      <Grid container justify="center">
        <Grid xs={12} sm={3} md={3} lg={4} xl={4} item>
          <Box display="flex" justifyContent="center">
            <Img src={image} alt={title} />
          </Box>
        </Grid>
        <Grid xs={12} sm={9} md={9} lg={8} xl={8} item>
          <Typography gutterBottom> {description} </Typography>
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
