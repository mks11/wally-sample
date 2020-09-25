import React, { useEffect } from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// Components
import Backdrop from 'common/Backdrop';
import Header from 'common/Header';
import Routes from 'routes';
import Footer from 'common/Footer';
import RootModal from 'modals/RootModal';
import RootModalV2 from 'modals/RootModalV2';
import LoadingSpinner from 'modals/LoadingSpinner';
import RootSnackbar from 'snackbars/RootSnackbar';

export default function Layout() {
  const {
    store: { user },
  } = useStores();

  useEffect(() => {
    user.getStatus();
  }, []);

  return (
    <div className="app">
      <Backdrop />
      {/* <TopNav /> */}
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
