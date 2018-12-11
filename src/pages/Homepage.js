import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom'
import { Row, Col, Input, Container } from 'reactstrap';
import { validateEmail, connect } from '../utils'


class Homepage extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      heroStatus: 'start',
      // model
      zip: '',
      email: '',
      heroText: 'Shop package-free groceries',
      heroDescription: 'Currently in beta in select zip codes.',
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
    this.zipStore = this.props.store.zip
    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  componentDidMount() {
    ReactGA.pageview("/");
    this.userStore.getStatus()
      .then((status) => {
        if (status) {
          const user = this.userStore.user
          if (user.type === 'admin') {
            this.routing.push('/manage/shopper')
          } else {
            this.routing.push('/main')
          }
        }
        this.setState({fetching: false})
      }).catch((e) => {
        console.error('Failed to get status', e)
        this.setState({fetching: false})
      })
  }

  handleValidateZip() {
    if (!this.state.zip) {
      this.setState({invalidZip: true})
      return
    }
    this.setState({invalidZip: false})

    this.zipStore.selectedZip = this.state.zip

    if (this.zipStore.validateZipCode(this.state.zip)) {
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

    this.zipStore.subscribeNotifications({email: this.state.email, zip: this.state.zip, subscribe: false})
      .then(() => {
        this.setState({
          heroStatus: 'invalid_zip_success',
          heroText: 'Thanks!\n We\'ll notify you when we launch in your area.\n Follow us on Instagram @thewallyshop and stay up to date on all things sustainability.',
          heroDescription: '',
        })
      }).catch((e) => {
        console.error('Failed to subscribe', e)
        const msg = e.response.data.error.message
        this.setState({invalidEmail: msg})
      })

  }

  handleStart(e) {
    const store = this.props.store
    this.routing.push('/main')
    store.modal.toggleSignup()
    e.preventDefault()
  }

  handleExplore(e) {
    this.routing.push('/main')
    e.preventDefault()
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
      
    const ButtonStart = () => (
      <button onClick={this.handleValidateZip} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        START SHOPPING
      </button>
    )
    
    const ButtonStartShopping = () => (
      <button onClick={this.handleStart} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        START SHOPPING
      </button>
    )

    const ButtonNotify = () => (
      <button onClick={this.handleSubscribe} id="btn-hero--submit" href="#nav-hero" className="btn btn-block mx-auto btn-success btn-get--started" data-submit="Submit">
        GET NOTIFIED
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
        <section id="nav-hero" className={heroClass}>
          <div className="container-fluid">
            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6">
                <h1 className="aw-hero--heading mb-4">{this.state.heroText}</h1>
                <h2 className={this.state.heroDescriptionAlign}>{this.state.heroDescription}</h2>

                {this.state.heroStatus === 'start' && 
                    <div>
                      <Input
                        className="zip"
                        type="number"
                        value={this.state.zip}
                        placeholder="Enter zip code..."
                        onKeyDown={this.handleZipEnter}
                        onChange={this.handleZip}/>
                      {this.state.invalidZip && <div className="text-error">Invalid zip codes</div>}
                      <ButtonStart/>
                    </div>
                }

                {this.state.heroStatus === 'invalid_zip' &&
                    <div>
                      <Input
                        className="zip"
                        type="text"
                        value={this.state.email}
                        placeholder="Enter your email..."
                        onKeyDown={this.handleEmailEnter}
                        onChange={this.handleEmail}
                      />
                      {this.state.invalidEmail && <div className="text-error">{this.state.invalidEmail}</div>}
                      <ButtonNotify/>
                    </div>
                }

                {this.state.heroStatus === 'success' && <ButtonStartShopping/>}

                {this.state.heroStatus === 'invalid_zip_success' && <ButtonExplore/>}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h2>It's what's on the inside that counts.</h2>
              <p></p>
              <p>Say goodbye to wasteful packaging with The Wally Shop. Order local, organic produce and we'll deliver it same-day from farmers markets and bulk stores. The best part? We deliver in all reusable packaging, which means no plastic. Ever. Return your packaging during a future delivery, and we'll clean and reuse it.</p>
              <p>You take care of the earth - we'll take care of the groceries.</p>
            </div>

            <div className="row">
              <div className="col-md-12 mb-md-4">
                <div className="row">
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home1_hd.jpg" alt=""/>
                      <h4>Shop produce from local, organic farmers markets & shops</h4>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home2_hd.jpg" alt=""/>
                      <h4>Get it delivered in all reusable packaging</h4>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home3_hd.jpg" alt=""/>
                      <h4>Return packaging at a future delivery for reuse</h4>
                    </div>
                  </div>
                </div>
                <Row>
                  <Col>
                    <div className="text-center">
                      <Link to="/main" className="btn btn-primary btn-explore">Explore</Link>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <br /><br />
          <div className="container">
            <h3>All available zip codes</h3>
            <hr />
            <div className="mb-5">
              <div className="row ">
                { this.zipStore.zipcodes.map((z,key) => (
                  <div className="col-sm-1" key={key}>{z}</div>
                ))}
              </div>
            </div>
          </div>
        </section> */}
        <section className="welcome-section">
          <Container>
            <Row>
              <Col sm={{ size: 5, offset: 1 }}>
                <h2>Welcome to the sustainable grocery solution</h2>
              </Col>
              <Col sm={5}>
                <p>The Wally Shop cares about the environment and really, really good food. We give you the best of both worlds by providing all reusable packaging, offering same day delivery, and bringing you the freshest local, organic produce - and we mean that. Because we source from local markets, your evening delivery will have produce that was on the farm that morning. It’s farmers market fresh, without the farmers market trip.</p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="homepage-info-section">
          <Row>
            <Col sm={6} className="order-2 order-sm-1">
              <div className="text-info-section float-right">
                <h2>We’re the 21st century milk man</h2>
                <p>With each order, The Wally Shop lends you our reusable packaging in exchange for a deposit fee, which you can easily return to a courier upon any future delivery. We’ll wash  and reuse all the returned packaging, and you’ll get your deposit fee back as store credit - so you can save money and the planet at the same time.</p>
              </div>
            </Col>
            <Col sm={6} className="order-1 order-sm-2">
              <div className="bg-info-section bg-info-section-1"></div>
            </Col>
          </Row>
        </section>
        <section className="homepage-info-section">
          <Row>
            <Col sm={6} className="order-1 order-sm-1">
              <div className="bg-info-section bg-info-section-2"></div>
            </Col>
            <Col sm={6} className="order-2 order-sm-2">
              <div className="text-info-section">
                <h2>Quality above all else</h2>
                <p>Want to know the secret to how professional chefs make amazing food with just a handful of ingredients? They get high quality, incredibly fresh produce from the farmers market. From ripe summer tomatoes to creamy butternut squashes to crispy apples, our couriers hand select the best market produce for all of your foodie needs.</p>
              </div>
            </Col>
          </Row>
        </section>
        <section className="welcome-section">
          <Container>
            <Row>
              <Col sm={{ size: 5, offset: 1 }}>
                <h2>Reduce > recycle</h2>
              </Col>
              <Col sm={5}>
                <p>While we’re all for recycling, reducing your waste is even better when it comes to making sustainable choices. That’s why we only offer reusable packaging like organic cotton bags and mason jars. So you can finally say goodbye to all of those pesky plastic bags.</p>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="welcome-section">
          <Container>
            <Row>
              <Col sm={{ size: 5, offset: 1 }}>
                <h2>Who is Wally?</h2>
              </Col>
              <Col sm={5}>
                <p>Our name was inspired by an incredible cooperative of individuals from India called the <i>dabbawalla</i>. Dubbed the world’s “best food delivery system”, they visit suburbs to pick up worker’s freshly made lunch tiffins - usually prepared by a wife - and deliver them to their respective husbands working in the city. After lunch, the tiffins are collected and returned. At The Wally Shop, our goal is similar: we offer same-day delivery and a completely closed loop system with exclusively reusable packaging. And by shopping at farmers markets and local stores for healthy, organic ingredients, The Wally Shop gives you a fresh take on package-free groceries.</p>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(Homepage);
