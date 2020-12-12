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

// Hooks
import { useStores } from 'hooks/mobx';

// Material UI
import { Box, Container, Typography } from '@material-ui/core';

// React Router
import { Link } from 'react-router-dom';

// Styled components
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

export default function Layout() {
  const { user, modalV2 } = useStores();
  const [cookies] = useCookies();
  const { hasReadCookieNotice } = cookies;

  useEffect(() => {
    if (!hasReadCookieNotice) {
      modalV2.open(<CookieNotice />, 'bottom', 'xl', { width: '100%' });
    }
  }, [hasReadCookieNotice]);

  useEffect(() => {
    user.getStatus();
  }, []);

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
    </div>
  );
}

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

  return (
    <Container maxWidth="xl">
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
    </Container>
  );
}
