import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import Routes from './routes';
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { CookiesProvider } from 'react-cookie';
import TopNav from 'common/TopNav';
import Footer from './common/Footer';
import ScrollToTop from './common/ScrollToTop';
import ScrollSpy from 'common/ScrollSpy';
import RootModal from './modals/RootModal';
import LoadingSpinner from 'modals/LoadingSpinner';
import Backdrop from './common/Backdrop';

//router
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';

//mobx
import store from './stores';

// Styles
import theme from 'mui-theme';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStroopwafel, faSearch } from '@fortawesome/free-solid-svg-icons';

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routing);

library.add(faStroopwafel, faSearch);

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_DEFAULT);
} else {
  ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_DEFAULT, {
    debug: true,
    testMode: true,
  });
}

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <Provider store={store}>
        <Router history={history}>
          <CookiesProvider>
            <ScrollSpy>
              <ScrollToTop>
                <div className="app">
                  <Backdrop />
                  <TopNav />
                  <main className="aw-main aw-home">
                    <Routes store={store} />
                  </main>
                  <Footer />
                  <RootModal />
                  <LoadingSpinner />
                </div>
              </ScrollToTop>
            </ScrollSpy>
          </CookiesProvider>
        </Router>
      </Provider>
    </StylesProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);

// registerServiceWorker();
