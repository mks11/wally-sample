import React, { lazy, Suspense } from 'react';

// Hooks
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';
import { useMediaQuery } from 'react-responsive';

// React Router
import { Link } from 'react-router-dom';

// Npm Packaged Components
import { Box, Container, Grid, Typography } from '@material-ui/core';

// Styling
import styled from 'styled-components';

// Custom Components
import Navbar from 'common/Header/NavBar';
import Banner from 'common/Banner';

// images
// import logoFull from 'images/logo-full.svg';
// import logoCondensed from 'images/logo-condensed.svg';

// const LogoCondensed = styled.img`
//   height: 40px;

//   @media only screen and (min-width: 567px) {
//     height: 40px;
//   }

//   @media only screen and (min-width: 768px) {
//     height: 44px;
//   }

//   @media only screen and (min-width: 992px) {
//     height: 48px;
//   }
// `;

// const LogoFull = styled.img`
//   height: 24px;

//   @media only screen and (min-width: 375px) {
//     height: 32px;
//   }

//   @media only screen and (min-width: 567px) {
//     height: 40px;
//   }

//   @media only screen and (min-width: 768px) {
//     height: 44px;
//   }

//   @media only screen and (min-width: 992px) {
//     height: 48px;
//   }
// `;
const LogoLink = styled(Link)`
  &&& {
    &:hover {
      text-decoration: none;
    }
  }
`;

const Logo = observer(() => {
  const shouldDisplayCondensedLogo = useMediaQuery({
    query: '(max-width: 480px)',
  });
  const { user, product } = useStores();

  var home = user.user ? '/main' : '/';
  const onLogoClick = () => {
    product.resetSearch();
  };

  return (
    <Box>
      <LogoLink to={home} onClick={onLogoClick}>
        {shouldDisplayCondensedLogo ? (
          <Typography variant="h1" style={{ fontSize: '4rem' }}>
            w
          </Typography>
        ) : (
          <Typography variant="h1">the wally shop</Typography>
        )}
      </LogoLink>
    </Box>
  );
});

const ProductTop = lazy(() => import('pages/Mainpage/ProductTop'));

const Header = observer(() => {
  const { routing } = useStores();
  const showProductTop = routing.location.pathname.includes('main');

  return (
    <Box
      component="header"
      position="sticky"
      top="0"
      zIndex={10}
      style={{ backgroundColor: '#fae1ff' }}
    >
      <Container maxWidth="xl">
        <Box py={2}>
          <Banner>
            <Typography> hello, 👋! </Typography>
            <Typography>
              “May the joys of the season shed light, hope and fill our hearts
              with peace.” “May the magic & thrill of the holiday season stretch
              on!” “May the special joys of the Season be your today and
              always.” “May the timeless message of Christmas fill your heart
              and home with joy today and throughout the coming year.”
            </Typography>
          </Banner>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Logo />
            </Grid>
            <Grid item>
              <Navbar />
            </Grid>
          </Grid>
        </Box>
      </Container>
      {showProductTop && (
        <Suspense fallback={<Typography>Search</Typography>}>
          <ProductTop />
        </Suspense>
      )}
    </Box>
  );
});

export default Header;
