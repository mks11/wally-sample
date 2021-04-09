import React, { useEffect } from 'react';

// Cookies
import { useCookies } from 'react-cookie';

// Custom Components
import Backdrop from 'common/Backdrop';
import Header from 'common/Header';
import Routes from 'routes';
import Footer from 'common/Footer';
import RootModal from 'modals/RootModal';
import RootModalV2 from 'modals/RootModalV2';
import LoadingSpinner from 'modals/LoadingSpinner';
import RootSnackbar from 'snackbars/RootSnackbar';

// Material UI
import { Box, Container, Typography } from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// React Router
import { Link } from 'react-router-dom';

import { useMediaQuery } from 'react-responsive';

// Styled components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import RootDialog from 'common/RootDialog';

const Layout = observer(() => {
  const { modalV2, user: userStore } = useStores();
  const { user, token } = userStore;
  const [cookies] = useCookies();
  const { hasReadCookieNotice } = cookies;

  useEffect(() => {
    if (!hasReadCookieNotice) {
      modalV2.open(<CookieNotice />, 'bottom', 'xl', { width: '100%' });
    }
  }, [hasReadCookieNotice]);

  useEffect(() => {
    loadUser();
  }, [token, user]);

  return (
    <div className="app">
      <Backdrop />
      <Header />
      <main className="aw-main aw-home">
        <Routes />
      </main>
      <Footer />
      <RootModal />
      <RootModalV2 />
      <RootSnackbar />
      <LoadingSpinner />
      <RootDialog />
    </div>
  );

  async function loadUser() {
    try {
      if (!user && !token) {
        await userStore.getStatus();
      }
    } catch (error) {
      console.error("Failed to verify user's authentication status");
    }
  }
});

export default Layout;

function CookieNotice() {
  const { modalV2 } = useStores();
  const [cookies, setCookie] = useCookies();

  const handleAcceptCookies = () => {
    setCookie('hasReadCookieNotice', true, {
      maxAge: 60 * 60 * 24 * 365 * 10,
      path: '/',
    });
    modalV2.close();
  };

  const isXs = useMediaQuery({ query: '(max-width: 566px)' });

  return (
    <Container maxWidth="xl">
      {isXs ? (
        <Box px={2}>
          <Typography component="h1" variant="h4" gutterBottom>
            Our Cookie Policy
          </Typography>
          <Typography gutterBottom>
            We use cookies to deliver a smooth shopping experience and to
            analyze traffic on our site.
          </Typography>
          <Link to="/privacy">
            <Typography gutterBottom>Learn More</Typography>
          </Link>
          <PrimaryWallyButton onClick={handleAcceptCookies} fullWidth>
            Got it!
          </PrimaryWallyButton>
        </Box>
      ) : (
        <Box
          px={4}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              Our Cookie Policy
            </Typography>
            <Typography gutterBottom>
              We use cookies to deliver a smooth shopping experience and to
              analyze traffic on our site.
            </Typography>
            <Link to="/privacy">
              <Typography gutterBottom>Learn More</Typography>
            </Link>
          </Box>
          <PrimaryWallyButton onClick={handleAcceptCookies}>
            Got it!
          </PrimaryWallyButton>
        </Box>
      )}
    </Container>
  );
}
