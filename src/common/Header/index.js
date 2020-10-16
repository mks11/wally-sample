import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// React Router
import { Link } from 'react-router-dom';

// Npm Packaged Components
import { Box, Container, Grid } from '@material-ui/core';

// Styling
import styled from 'styled-components';

// Custom Components
import Navbar from 'common/Header/NavBar';

const LogoFull = styled.img`
  height: 24px;

  @media only screen and (min-width: 375px) {
    height: 32px;
  }

  @media only screen and (min-width: 567px) {
    height: 40px;
  }

  @media only screen and (min-width: 768px) {
    height: 44px;
  }

  @media only screen and (min-width: 992px) {
    height: 48px;
  }
`;

const Logo = observer(() => {
  const { user, product } = useStores();

  var home = user.user ? '/main' : '/';

  const onLogoClick = () => {
    product.resetSearch();
  };

  return (
    <Box>
      <Link to={home} onClick={onLogoClick}>
        <LogoFull src="/images/logo-full.svg" alt="The Wally Shop logo." />
      </Link>
    </Box>
  );
});

const HeaderWrapper = styled(Box)`
  @media only screen and (min-width: 768px) {
    padding: 1rem 0;
  }
`;

export default function Header() {
  return (
    <HeaderWrapper
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
    </HeaderWrapper>
  );
}
