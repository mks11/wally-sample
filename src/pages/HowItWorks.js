import React, { Component } from "react";

import { logPageView } from "services/google-analytics";
import { connect } from "../utils";

import Head from "../common/Head";
import Title from "../common/page/Title";

class HowItWorks extends Component {
  constructor(props, context) {
    super(props, context);
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;
  }
  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
  }
  render() {
    return (
      <div className="App align-items-center">
        <Head
          title="How it Works"
          description="Learn about The Wally Shop service."
        />
        <Title content="Our Process" center />

        <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="tagline">
              <h2>It's what's on the inside that counts.</h2>
              <p></p>
              <p>
                We are introducing a whole new way to shop sustainably. Our
                vision is to help you shop for everything (Bulk foods! Beauty
                products! Household products!) conveniently in all reusable
                packaging. We’re starting with responsibly-made, Trader Joe’s
                price-competitive bulk foods, but we will be expanding
                categories and on-boarding more brands in the coming weeks. We
                want to get you what you need, 100% waste free, so please reach
                out if you have any brands in mind ;)
              </p>
              <p>
                We hope you’re as ready as we are to join the
                #reusablesrevolution and change the world in dreamy purple ~ one
                order at a time. #wallydreamsinpurple
              </p>
            </div>

            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Order</h1>
                  <p>
                    Choose from hundreds of responsibly-made, Trader Joe’s
                    price-competitive bulk foods. At checkout, you will be
                    charged a deposit for your packaging (don’t worry, you will
                    be getting it back!).
                  </p>
                </div>
              </div>
              <OrderPhoto />
            </div>

            <div className="row d-flex justify-content-center align-items-center mt-5">
              <TotePhoto />
              <div className="receive-item receive-div col-12 col-sm-10 col-md-8 col-lg-6 col-lg-offset-2 col-md-offset-2">
                <div className="receive-item w-75 pull-right">
                  <h1>Receive</h1>
                  <p className="receive-item">
                    Your order will arrive at your doorstep in completely
                    reusable, returnable packaging. The shipping tote it arrives
                    in folds up for easy storage. Simple, convenient, 100% waste
                    free shopping.
                  </p>
                </div>
              </div>
            </div>

            <div className="row d-flex mt-5 justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Return</h1>
                  <p>
                    Once finished, you can return all your packaging (jars,
                    totes, anything we send to you, we take back and reuse) to a
                    FedEx/UPS delivery courier on a future delivery or schedule
                    a free pick-up on the website. Your deposit is credited back
                    to you and the packaging is cleaned to be put back into
                    circulation.
                  </p>
                </div>
              </div>
              <ReturnPackagingPhoto />
            </div>
          </div>

          <br />
          <br />
        </section>
      </div>
    );
  }
}

export default connect("store")(HowItWorks);

function OrderPhoto(){
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
      <img srcSet="images/order-hd-450.jpg 450w,
                   images/order-hd-600.jpg 600w"
                   sizes="(max-width: 767px) 450px,
                   600px"
                   src="images/order-hd-600.jpg"
                   alt="Man giving money in exchange for a jar of pasta." />
    </div>
  )
}

function TotePhoto(){
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6">
      <img srcSet="images/tote-hd-450.jpg 450w,
                   images/tote-hd-600.jpg 600w"
                   sizes="(max-width: 767px) 450px,
                   600px"
                   src="images/tote-hd-600.jpg"
                   alt="The Wally Shop's reusable tote." />
    </div>
  )
}

function ReturnPackagingPhoto(){
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
      <img srcSet="images/return-packaging-hd-450.jpg 450w,
                   images/return-packaging-hd-600.jpg 600w"
                   sizes="(max-width: 767px) 450px,
                   600px"
                   src="images/return-packaging-hd-600.jpg"
                   alt="Returning an empty jar." />
      </div>
  )
}
