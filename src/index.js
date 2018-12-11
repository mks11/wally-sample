import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import routes from './routes';
import TopNav from './common/TopNav.js'
import Footer from './common/Footer.js'

import ScrollToTop from './common/ScrollToTop.js'
import LoginModal from './common/LoginModal.js'
import SignupModal from './common/SignupModal.js'
import WelcomeModal from './common/WelcomeModal.js'
import ZipModal from './common/ZipModal.js'
import InvalidZipModal from './common/InvalidZipModal.js'
import InvalidZipSuccessModal from './common/InvalidZipSuccessModal.js'
import InviteModal from './common/InviteModal.js'
import ReferralModal from './common/ReferralModal'
import ReferralResultModal from './common/ReferralResultModal'
import DeleteModal from './common/DeleteModal.js'
import Backdrop from './common/Backdrop.js'

//router
import { Router } from 'react-router-dom'
import { Provider } from 'mobx-react'
import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

//redux
import store  from './stores'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel)

const routingStore = new RouterStore()
const browserHistory = createBrowserHistory()

store.routing = routingStore

// ReactGA.initialize('UA-128193575-1', { debug: true });
ReactGA.initialize('UA-128193575-1');

const history = syncHistoryWithStore(browserHistory, routingStore)


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <ScrollToTop>
        <div className="app">
          <Backdrop/>
          <TopNav/>
          <main className="aw-main aw-home">
            {routes}
          </main>
          <Footer/>
          <LoginModal/>
          <SignupModal/>
          <WelcomeModal/>
          <ZipModal/>
          <InvalidZipModal/>
          <InvalidZipSuccessModal/>
          <InviteModal/>
          <DeleteModal/>
          <ReferralModal/>
          <ReferralResultModal/>
        </div> 
      </ScrollToTop>
    </Router>
  </Provider>
  , document.getElementById('root'));

// registerServiceWorker();
