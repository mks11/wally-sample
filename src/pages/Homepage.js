import React, { Component } from 'react';
import { logPageView, logModalView } from 'services/google-analytics';
import qs from 'qs';
import { Row, Col } from 'reactstrap';
import { connect } from '../utils';
import SignupForm from 'forms/authentication/SignupForm';

class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      // model
      zip: '',
      email: '',
      audienceSource: '',
      heroText: 'Shop package-free groceries',
      heroDescription:
        "In response to Covid-19, The Wally Shop has no more waitlist, making access to food available to all.\n For every order placed, we'll also be donating $1 to Feeding America.",
      heroDescriptionAlign: 'center',

      invalidEmail: false,
      invalidZip: false,

      width: window.innerWidth,
    };

    //input
    this.handleEmail = this.handleEmail.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.zipStore = this.props.store.zip;
    this.userStore = this.props.store.user;
    this.modalStore = this.props.store.modal;
    this.modalV2Store = this.props.store.modalV2;
    this.routing = this.props.store.routing;
    this.metricStore = this.props.store.metric;
  }

  componentDidMount() {
    const { location } = this.routing;
    logPageView(location.pathname);

    if (
      qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).color
    ) {
      if (
        qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
          .color === 'purple'
      ) {
        this.setState({ audienceSource: 'ig' });
        this.metricStore.triggerAudienceSource('ig');
      }
    }

    this.userStore
      .getStatus()
      .then((status) => {
        if (status) {
          const user = this.userStore.user;
          console.log(user.type);
          if (user.type === 'admin') {
            this.routing.push('/manage/retail');
          } else {
            this.routing.push('/main');
          }
        }
        this.setState({ fetching: false });
      })
      .catch((e) => {
        console.error('Failed to get status', e);
        this.setState({ fetching: false });
      });

    window.$('body').addClass('homepage-background');
  }

  componentWillUnmount() {
    window.$('body').removeClass('homepage-background');
  }

  handleSignup(e) {
    logModalView('/signup-zip');
    this.modalV2Store.open(<SignupForm />);
  }

  handleEmail(e) {
    this.setState({ email: e.target.value });
    e.preventDefault();
  }

  render() {
    const StartShoppingButton = () => (
      <button
        onClick={this.handleSignup}
        id="btn-hero--submit"
        href="#nav-hero"
        className="btn btn-block mx-auto btn-success btn-get--started"
        data-submit="Submit"
      >
        START SHOPPING
      </button>
    );

    const isMobile = this.state.width <= 500;
    const isMobileHoriz = this.state.width > 500 && this.state.width <= 800;
    let heroClass = 'landing-section aw-hero';
    if (isMobile) {
      heroClass += ' mobile';
    }
    if (isMobileHoriz) {
      heroClass += ' mobile-horiz';
    }

    return (
      <div className="homepage">
        <section className="align-items-center">
          <div className="container scroll-text">
            <div>
              <br></br>
            </div>
            <div id="div-1-scroll" className="">
              <h1>
                Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
                nationwide ~{' '}
              </h1>
            </div>
            <div id="div-2-scroll" className="">
              <h1>
                Now shipping nationwide ~ Now shipping nationwide ~ Now shipping
                nationwide ~{' '}
              </h1>
            </div>
          </div>
        </section>
        <section id="nav-hero" className={heroClass}>
          <div className="container-fluid">
            <div className="row justify-content-center align-items-center">
              <IntroPhoto />

              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <h1 className="aw-hero--heading mb-4">{this.state.heroText}</h1>
                <h2 className={this.state.heroDescriptionAlign}>
                  {this.state.heroDescription}
                </h2>
                <div className="mt-5">
                  <StartShoppingButton />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="tagline">
              <h2>Do you with reusables.</h2>
              <p></p>
              <p>
                The Wally Shop is the platform connecting you with your favorite
                brands 100% waste-free IRL and we are now available nationwide{' '}
                <span role="img" aria-label="sprinkle">
                  ✨
                </span>{' '}
                Our vision is to help you shop for everything in all reusable
                packaging (cleaning, beauty, pet supplies, you name it!).
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

            <div className="row mt-5">
              <div className="col-md-12 mb-md-4">
                <Row>
                  <Col>
                    <div className="text-center">
                      <StartShoppingButton />
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <br />
          <br />
        </section>
      </div>
    );
  }
}

export default connect('store')(Homepage);

function IntroPhoto() {
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2 mt-5">
      <img
        srcSet="images/intro-450.jpg 450w,
                   images/intro-600.jpg 600w"
        sizes="(max-width: 767px) 450px,
                  600px"
        src="images/intro-600.jpg"
        alt="Man holding jar of green lentils."
      />
    </div>
  );
}

function OrderPhoto() {
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
      <img
        srcSet="images/order-450.jpg 450w,
                   images/order-600.jpg 600w"
        sizes="(max-width: 767px) 450px,
                  600px"
        src="images/order-600.jpg"
        alt="Man giving money in exchange for a jar of pasta."
      />
    </div>
  );
}

function TotePhoto() {
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6">
      <img
        srcSet="images/tote-450.jpg 450w,
                   images/tote-600.jpg 600w"
        sizes="(max-width: 767px) 450px,
                  600px"
        src="images/tote-600.jpg"
        alt="The Wally Shop's reusable tote."
      />
    </div>
  );
}

function ReturnPackagingPhoto() {
  return (
    <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
      <img
        srcSet="images/return-packaging-450.jpg 450w,
                   images/return-packaging-600.jpg 600w"
        sizes="(max-width: 767px) 450px,
                  600px"
        src="images/return-packaging-600.jpg"
        alt="Returning an empty jar."
      />
    </div>
  );
}
