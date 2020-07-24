import React, { Component } from 'react';
import ReactGA from 'react-ga';
import qs from 'qs';
import { Row, Col } from 'reactstrap';
import { validateEmail, connect, logEvent, logModalView } from '../utils'


class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      heroStatus: 'start',
      // model
      zip: '',
      email: '',
      audienceSource: '',
      heroText: 'Shop package-free groceries',
      heroDescription: "In response to Covid-19, The Wally Shop has no more waitlist, making access to food available to all.\n For every order placed, we'll also be donating $1 to Feeding America.",
      heroDescriptionAlign: 'center',

      invalidEmail: false,
      invalidZip: false,

      fetching: true,
      width: window.innerWidth


    };

    //input
    this.handleZip = this.handleZip.bind(this)
    this.handleEmail = this.handleEmail.bind(this)

    this.handleValidateZip = this.handleValidateZip.bind(this)
    this.handleSubscribe = this.handleSubscribe.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleExplore = this.handleExplore.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.zipStore = this.props.store.zip
    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
    this.metricStore = this.props.store.metric
  }

  componentDidMount() {
    ReactGA.pageview("/");
    if (qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).color) {
      if (qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).color === "purple") {
        this.setState({ audienceSource: "ig" });
        this.metricStore.triggerAudienceSource("ig");
      }
    }

    this.userStore.getStatus()
      .then((status) => {
        if (status) {
          const user = this.userStore.user
          if (user.type === 'admin') {
            this.routing.push('/manage/shopper')
          } else if (user.type === 'tws-ops') {
            this.routing.push('/manage/shopping-app-1')
          } else {
            this.routing.push('/main')
          }
        }
        this.setState({fetching: false})
      }).catch((e) => {
        console.error('Failed to get status', e)
        this.setState({fetching: false})
      })

    this.zipStore.loadZipCodes()
      .catch((e) => {
        console.error('Failed to load zipcodes: ', e)
      })

    window.$('body').addClass('homepage-background');
  }

  componentWillUnmount() {
    window.$('body').removeClass('homepage-background');
  }

  handleValidateZip() {
    if (!this.state.zip) {
      this.setState({invalidZip: true})
      return
    }
    this.setState({invalidZip: false})

    this.zipStore.selectedZip = this.state.zip
    logEvent({ category: "Homepage", action: "SubmitZip", label: this.state.zip })
    if (this.zipStore.validateZipCode(this.state.zip)) {
      this.zipStore.setZip(this.state.zip)
      this.setState({
        heroStatus: 'success',
        heroText: 'Huzzah! It looks like we\'re in your zip code.',
        heroDescription: 'Click here to start shopping.',
      })
    } else {
      this.setState({
        heroStatus: 'invalid_zip',
        heroText: 'Hope to be there soon!',
        heroDescription: 'We\'re not in your zip code yet, but sign up and we\'ll send you a notification when we are.',
      })
    }
  }

  handleSubscribe() {
    if (!validateEmail(this.state.email)) {
      this.setState({invalidEmail: 'Invalid Email'})
      return
    }

    this.setState({invalidEmail: ''})
    logEvent({ category: "Homepage", action: "SubmitEmail", value: this.state.zip, label: "GetNotified" })
    this.userStore.getWaitlistInfo({ email: this.state.email, src: this.state.audienceSource })
      .then(res => {
        this.modalStore.toggleModal('waitinglist', null, res)
      }).catch(() => {
        this.modalStore.toggleModal('error', 'Something went wrong during your request')
      })

  }

  handleStart(e) {
    logEvent({ category: "Homepage", action: "StartShopping" })
    this.routing.push('/main')
    logModalView('/signup-info')
    this.modalStore.toggleModal('joinwaitlist')
    e.preventDefault()
  }

  handleExplore(e) {
    logEvent({ category: "Homepage", action: "ExploreShopping" })
    this.routing.push('/main')
    e.preventDefault()
  }

  handleSignup(e) {
    logModalView('/signup-zip')
    this.modalStore.toggleModal('signup')
  }

  handleZip(e) {
    this.setState({zip: e.target.value})
    e.preventDefault()
  }

  handleEmail(e) {
    this.setState({email: e.target.value})
    e.preventDefault()
  }

  handleZipEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleValidateZip()
    }
  }

  handleEmailEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSubscribe()
    }
  }

  render() {
    if (this.state.fetching) return null

    const ButtonStartShopping = () => (
      <button onClick={this.handleStart} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        START SHOPPING
      </button>
    )

    const ButtonNotify = () => (
      <button onClick={this.handleSignup} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        START SHOPPING
      </button>
    )

    const ButtonExplore = () => (
      <button onClick={this.handleExplore} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        EXPLORE
      </button>
    )

    const isMobile = this.state.width <= 500;
    const isMobileHoriz = (this.state.width > 500 && this.state.width <= 800);
    let heroClass = "landing-section aw-hero"
    if (isMobile) {
      heroClass += ' mobile'
    }
    if (isMobileHoriz) {
      heroClass += ' mobile-horiz'
    }

    return (
      <div className="homepage">
        <section className="align-items-center">
          <div className="container scroll-text">
            <div>
            <br></br>
            </div>
            <div id="div-1-scroll" className="">
              <h1>Now shipping nationwide ~ Now shipping nationwide ~ Now shipping nationwide ~ </h1>
            </div>
            <div id="div-2-scroll" className="">
              <h1>Now shipping nationwide ~ Now shipping nationwide ~ Now shipping nationwide ~ </h1>
            </div>
          </div>
        </section>
        <section id="nav-hero" className={heroClass}>
          <div className="container-fluid">
            <div className="row justify-content-center align-items-center">

              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2 mt-5">
                <img src="images/cradle_6.jpg" alt=""/>
              </div>

              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <h1 className="aw-hero--heading mb-4">{this.state.heroText}</h1>
                <h2 className={this.state.heroDescriptionAlign}>{this.state.heroDescription}</h2>
                <div className="mt-5">
                  <ButtonNotify/>
                </div>

                {this.state.heroStatus === 'success' && <ButtonStartShopping/>}

                {this.state.heroStatus === 'invalid_zip_success' && <ButtonExplore/>}
              </div>
            </div>
          </div>
        </section>

        <section className="page-section aw-our--story align-items-center">
          <div className="container h-75 w-75">
            <div className="tagline">
              <h2>Do you with reusables.</h2>
              <p></p>
              <p>The Wally Shop is the platform connecting you with your favorite brands 100% waste-free IRL and we are now available nationwide <span role="img" aria-label="sprinkle" >✨</span> Our vision is to help you shop for everything in all reusable packaging (cleaning, beauty, pet supplies, you name it!).</p>
              <p>We hope you’re as ready as we are to join the #reusablesrevolution and change the world in dreamy purple ~ one order at a time. #wallydreamsinpurple</p>
            </div>

            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 order-lg-1 order-md-2 order-sm-2 order-2">
                <div className="w-75 pl-lg-4">
                  <h1>Order</h1>
                  <p>Choose from hundreds of responsibly-made, Trader Joe’s price-competitive bulk foods. At checkout, you will be charged a deposit for your packaging (don’t worry, you will be getting it back!).</p>
                </div>
              </div>
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6 order-lg-2 order-md-1 order-sm-1 order-1">
                <img src="images/jar_3.jpg" alt=""/>
              </div>
            </div>


            <div className="row d-flex justify-content-center align-items-center mt-5">
              <div className="howto-item col-12 col-sm-10 col-md-8 col-lg-6">
                <img src="images/tote.jpg" alt=""/>
              </div>
              <div className="receive-item receive-div col-12 col-sm-10 col-md-8 col-lg-6 col-lg-offset-2 col-md-offset-2">
                <div className="receive-item w-75 pull-right">
                  <h1>Receive</h1>
                  <p className="receive-item">Your order will arrive at your doorstep in completely reusable, returnable packaging. The shipping tote it arrives in folds up for easy storage. Simple, convenient, 100% waste free shopping.</p>
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
                {/* <img src="images/home8_hd.png" alt=""/> */}
                <img src="images/jar_2.jpg" alt=""/>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-md-12 mb-md-4">
                <Row>
                  <Col>
                    <div className="text-center">
                      <button onClick={this.handleSignup} id="btn-hero--submit" href="#nav-hero" className="btn btn-primary btn-explore" data-submit="Submit">
                        START SHOPPING
                      </button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <br /><br />
        </section>
      </div>
    );
  }
}

export default connect("store")(Homepage);
