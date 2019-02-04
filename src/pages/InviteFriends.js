import React, { Component } from 'react';
import { connect, logEvent, logModalView, logPageView } from '../utils'
import ReactGA from 'react-ga';


class InviteFriends extends Component {
  constructor(props, context) {
    super(props, context);
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  handleSignup() {
    logEvent({ category: "ReferSignup", action: "StartSignup" })
    this.modalStore.toggleModal('zip')
    this.routing.push('/main')
  }

  render() {
    ReactGA.pageview(window.location.pathname);
    return (
      <section className="page-section bg-fruitfull">
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-4">
              <h1 className="text-white">Shop package-free groceries</h1>
            </div>
            <div class="col-md-6">
              <div className="card">
                <h3 className="m-0 mb-2">You've been hooked up with 15% off orders your first month.</h3>
                <span className="mb-3">Sign up and get your discount for your first month.</span>
                <button className="btn btn-main mt-3 active" onClick={e=>this.handleSignup()}>SIGN UP</button>
              </div>
          </div>
        </div>
      </div>
    </section>
    );
  }
}

export default connect("store")(InviteFriends);
