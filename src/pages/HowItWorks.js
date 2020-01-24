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
         <Title content="Our Process" />

         <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Order</h1>
                  <p>Shop produce from local, organic farmers markets & shops</p>
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
                  <p className="receive-item">Get it delivered in all reusable packaging</p>
                </div>
              </div>
            </div>

            <div className="row d-flex mt-5 justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Return</h1>
                  <p>Return packaging at a future delivery for reuse</p>
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
