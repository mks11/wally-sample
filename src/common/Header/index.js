import React from 'react';
import PropTypes from 'prop-types';

// Hooks
import { useStores } from 'hooks/mobx';

// React Router
import { Link } from 'react-router-dom';

// Npm Packaged Components
import { Box, Container, Grid } from '@material-ui/core';
import { MobileView, BrowserView } from 'react-device-detect';

// Styling
import styled from 'styled-components';

// Custom Components
import Navbar from 'common/Header/NavBar';

export default function Header() {
  return (
    <Box
      component="header"
      position="sticky"
      top="0"
      zIndex={10}
      style={{ backgroundColor: '#fae1ff' }}
    >
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Logo />
          </Grid>
          <Grid item>
            <Navbar />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const LogoDesktop = styled.img`
  height: 48px;

  @media only screen and (width < 992px) {
    height: 44px;
  }

  @media only screen and (width < 768px) {
    height: 40px;
  }
`;

const LogoMobile = styled.img`
  height: 32px;
`;

function Logo() {
  const { user, product } = useStores();

  var home = user.user ? '/main' : '/';

  const onLogoClick = () => {
    product.resetSearch();
  };

  return (
    <Box>
      <Link to={home} onClick={onLogoClick}>
        {/* <MobileView> */}
        <LogoMobile src="/images/logo-full.svg" alt="The Wally Shop W logo." />
        {/* </MobileView>
        <BrowserView>
          <LogoDesktop
            src="/images/logo-full.svg"
            alt="The Wally Shop W logo."
          />
        </BrowserView> */}
      </Link>
    </Box>
  );
}
