import React, { Component } from "react";

import { logPageView, logModalView } from "services/google-analytics";
import { connect } from "../utils";

import Head from "../common/Head";

class About extends Component {
  constructor(props, context) {
    super(props, context);
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;
    this.modalStore = this.props.store.modal;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
    this.userStore.getStatus();
  }

  handleLogin = () => {
    logModalView("/login");
    this.routing.push("/main");
    this.modalStore.toggleModal("login");
  };

  render() {
    return (
      <div className="App">
        <Head
          title="Latest News"
          description="Latest news from The Wally Shop."
        />
        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h1>The Wally Shop COVID-19 Response</h1>
              <p className="">
                We know times have been tough. With COVID-19 radically changing
                our day-to-day lives, our team has been trying to think of ways
                that we can help. We know that having safe access to groceries
                is a concern for many right now, especially those who are most
                vulnerable. That’s why starting today, we are removing the
                waitlist and opening up The Wally Shop to everyone.
                <br></br>
                <br></br>
                We are so excited to give everyone access to pantry staples and
                your favorite snacks, 100% waste-free! However, by unlocking the
                waitlist much earlier than expected, we expect to go out of
                stock and be challenged operationally. We ask for your patience
                as we work diligently to ensure our inventory keeps up!
                <br></br>
                <br></br>
              </p>
              <h2>The Wally Shop x Feeding America</h2>
              <p>
                In addition, we’re donating $1 for every order you place to
                Feeding America and their COVID-19 fund through April 30th.
                Feeding America helps millions of Americans access food every
                day and now, more than ever, it’s crucial to help this mission.
                <br></br>
                <br></br>
              </p>
              <h2>Supporting those who need it most</h2>
              <p>
                Lastly, we want to help the most vulnerable members of our
                community, so we’re giving our customers who are healthcare,
                emergency service workers & seniors 65+ free shipping on their
                orders - just email us at covid19@thewallyshop.co with a copy of
                your badge (for healthcare & emergency services workers) or
                driver's license (for seniors 65+), so we can make sure everyone
                that needs safe access to groceries has it.
              </p>
            </div>
          </div>
          <div className="tagline">
            <button
              onClick={this.handleLogin}
              id="btn-hero--submit"
              className="btn btn-block mx-auto btn-success btn-get--started"
              data-submit="Submit"
            >
              START SHOPPING
            </button>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(About);
