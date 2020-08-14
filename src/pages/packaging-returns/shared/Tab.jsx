import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Container, Grid, Typography } from '@material-ui/core';
import styles from './Tab.module.css';

function Tab({ title, children, ...rest }) {
  return (
    <Container maxWidth={'lg'} {...rest}>
      <Grid container justify="center" spacing={2}>
        <Grid item xm={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant={'h1'} className={styles.title}>
            {title}
          </Typography>
        </Grid>
      </Grid>
      <Fragment>{children}</Fragment>
    </Container>
  );
}

Tab.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
  title: PropTypes.string.isRequired,
};

export default Tab;
