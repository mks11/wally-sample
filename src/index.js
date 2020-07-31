import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import Routes from './routes';

import Head from './common/Head';
import TopNav from './common/TopNav';
import Footer from './common/Footer';
import ScrollToTop from './common/ScrollToTop';
import ScrollSpy from 'common/ScrollSpy';
import RootModal from './modals/RootModal';
import Backdrop from './common/Backdrop';

//router
import { Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

//mobx
import store from './stores';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faStroopwafel, faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faStroopwafel, faSearch);

const routingStore = new RouterStore();
const browserHistory = createBrowserHistory();

store.routing = routingStore;

// ReactGA.initialize('UA-128193575-1', { debug: true });
ReactGA.initialize('UA-128193575-1');

const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ScrollSpy>
        <ScrollToTop>
          <div className="app">
            <Head
              title="The Wally Shop"
              description="Your favorite grocery brands delivered nationwide in 100% reusable packaging."
            />
            <Backdrop />
            <TopNav />
            <main className="aw-main aw-home">
              <Routes />
            </main>

            <Footer />
            <RootModal />
          </div>
        </ScrollToTop>
      </ScrollSpy>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

// registerServiceWorker();
