import React, { Component } from 'react';
import Title from '../common/page/Title';
import ReactGA from 'react-ga';
import { connect, logEvent, logModalView, logPageView } from '../utils'

class HowItWorks extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }
  render() {
    return (
      <div className="App align-items-center">
         <Title content="Our Process" center />

         <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Order</h1>
                  <p>Choose from hundreds of responsibly-made, Trader Joe’s price-competitive bulk foods. At checkout, you will be charged a deposit for your packaging (don’t worry, you will be getting it back!).</p>
                </div>
              </div>
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <img src="images/home6_hd.png" alt=""/>
              </div>
            </div>


            <div className="row d-flex justify-content-center align-items-center mt-5">
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6">
                <img src="images/home7_hd.png" alt=""/>
              </div>
              <div className="receive-item receive-div col-12 col-sm-10 col-md-8 col-lg-6 col-lg-offset-2 col-md-offset-2">
                <div className="receive-item w-75 pull-right">
                  <h1>Receive</h1>
                  <p className="receive-item">our order will arrive at your doorstep in completely reusable, returnable packaging. The shipping tote it arrives in folds up for easy storage. Simple, convenient, 100% waste free shopping.</p>
                </div>
              </div>
            </div>

            <div className="row d-flex mt-5 justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Return</h1>
                  <p>Once finished, you can return all your packaging (jars, totes, anything we send to you, we take back and reuse) to a FedEx/UPS delivery courier on a future delivery or schedule a free pick-up on the website. Your deposit is credited back to you and the packaging is cleaned to be put back into circulation.</p>
                </div>
              </div>
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <img src="images/home8_hd.png" alt=""/>
              </div>
            </div>
          </div>

          <br /><br />
        </section>
      </div>
    );
  }
}

export default connect("store")(HowItWorks);
