import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Link } from 'react-router-dom'
import { Row, Col, Input } from 'reactstrap';
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
                        placeholder="Enter zipcode..."
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

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h2>It's what's on the inside that counts.</h2>
              <p></p>
              <p>The Wally Shop is your sustainable grocery solution. Order your favorite local, organic produce and have it delivered same-day in all reusable packaging. This means no plastic packaging. Ever. 
              Return your packaging during a future delivery, and we'll clean and reuse it.</p>
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
        </section>
      </div>
    );
  }
}

export default connect("store")(Homepage);
