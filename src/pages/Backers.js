import React, { Component } from "react";
import { logPageView } from "services/google-analytics";

import { connect } from "../utils";

import Head from "../common/Head";

class Backers extends Component {
  constructor(props) {
    super(props);

    this.backerStore = this.props.store.backer;
    this.modalStore = this.props.store.modal;
    this.routing = this.props.store.routing;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
    this.loadData();
  }

  loadData() {
    this.backerStore
      .loadBackers()
      .then((data) => {
        // data loaded
      })
      .catch((e) => {
        console.error("Failed to load backers", e);
        this.modalStore.toggleModal("error");
      });
  }

  render() {
    return (
      <div className="App">
        <Head
          title="Our Backers"
          description="The Wally Shop's Kick-Starter backers."
        />
        <section className="page-section aw-our--story">
          <div className="container">
            <div className="text-center">
              <h1>Our Backers</h1>
              <h3>
                We are extremely grateful to the following people who made this
                all possible:
              </h3>
              <hr />
            </div>
          </div>
        </section>
        <div className="container">
          <div className="row">
            {this.backerStore.backers.map((b, key) => (
              <span className="col-sm-4" key={key}>
                <p className="text-center">{b}</p>
              </span>
            ))}
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default connect("store")(Backers);
