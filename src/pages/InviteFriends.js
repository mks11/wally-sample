import React, { Component } from 'react';

import { logPageView, logEvent } from 'services/google-analytics';
import { connect } from '../utils';

import SignupForm from 'forms/authentication/SignupForm';
import inviteFriends450 from 'images/invite-friends-450.jpg';
import inviteFriends600 from 'images/invite-friends-600.jpg';

class InviteFriends extends Component {
  constructor(props) {
    super(props);

    this.modalV2Store = this.props.store.modalV2;
    this.routing = this.props.store.routing;
  }

  handleSignup = () => {
    logEvent({ category: 'ReferSignup', action: 'StartSignup' });
    this.modalV2Store.open(<SignupForm />);
    this.routing.push('/main');
  };

  render() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);

    const isMobile = window.innerWidth <= 500;
    const isMobileHoriz = window.innerWidth > 500 && window.innerWidth <= 800;
    let heroClass = 'landing-section aw-hero homepage';
    if (isMobile) {
      heroClass += ' mobile';
    }
    if (isMobileHoriz) {
      heroClass += ' mobile-horiz';
    }

    return (
      <section id="nav-hero" className={heroClass}>
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center">
            <InviteFriendsPhoto />

            <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
              <h1 className="aw-hero--heading mb-4">
                Shop package-free groceries
              </h1>
              <h2 className="center">
                Pantry staples & favorite snacks conveniently delivered in our
                reusable, returnable packaging for a completely waste-free
                experience.
              </h2>
              <div className="mt-5">
                <button
                  onClick={this.handleSignup}
                  id="btn-hero--submit"
                  href="#nav-hero"
                  className="btn btn-block mx-auto btn-success btn-get--started"
                  data-submit="Submit"
                >
                  START SHOPPING
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default connect('store')(InviteFriends);

function InviteFriendsPhoto() {
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2 mt-5">
      <img
        srcSet={`${inviteFriends450} 450w,
                   ${inviteFriends600} 600w`}
        sizes="(max-width: 767px) 450px,
                   600px"
        src={inviteFriends600}
        alt="Man giving money in exchange for a jar of pasta."
      />
    </div>
  );
}
