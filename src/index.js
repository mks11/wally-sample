import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

// Components
import ScrollToTop from './common/ScrollToTop';
import ScrollSpy from 'common/ScrollSpy';
import Layout from 'templates/Layout';

// Context
import { ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import { Provider } from 'mobx-react';

//router
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { syncHistoryWithStore } from 'mobx-react-router';

//mobx
import store from './stores';

// Styles
import 'css/main.css';
import 'css/styles.css';
import theme from 'mui-theme';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_API_KEY } from 'config';

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routing);

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_DEFAULT);
} else {
  ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_DEFAULT, {
    debug: true,
    testMode: true,
  });
}

const stripePromise = loadStripe(STRIPE_API_KEY);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StylesProvider injectFirst>
      <Provider store={store}>
        <Elements stripe={stripePromise}>
          <Router history={history}>
            <ScrollSpy>
              <ScrollToTop>
                <Layout />
              </ScrollToTop>
            </ScrollSpy>
          </Router>
        </Elements>
      </Provider>
    </StylesProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);

// registerServiceWorker();
