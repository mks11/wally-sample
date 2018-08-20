import React, { Component } from 'react';
import { Button, FormGroup, Input, ControlLabel, HelpBlock } from 'reactstrap';
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
      heroDescription: 'Currently in beta in select zipcodes',
      heroDescriptionAlign: 'center',

      invalidEmail: false,
      invalidZip: false,

      fetching: true

    };

    //input
    this.handleZip = this.handleZip.bind(this)
    this.handleEmail = this.handleEmail.bind(this)

    this.handleValidateZip = this.handleValidateZip.bind(this)
    this.handleSubscribe = this.handleSubscribe.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.zipStore = this.props.store.zip
    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        if (status) {
          this.routing.push('/main')
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

    if (this.zipStore.validateZipCode(this.state.zip)) {
      this.setState({
        heroStatus: 'success',
        heroText: 'Hurrah! Looks like we are in your zipcodes',
        heroDescription: 'We are also excited  to be servicing you and your grocery needs completely package free. We are currently in beta and look forward to hearing your thoughts on how we can  make the Wally Shop the best experience for you',
        heroDescriptionAlign: 'left'
      })
    } else {
      this.setState({
        heroStatus: 'invalid_zip',
        heroText: 'Hope to be there soon!',
        heroDescription: 'We are not currently servicing your zipcode. Input your email below to get notified when we are!',
      })
    }
  }

  handleSubscribe() {
    if (!validateEmail(this.state.email)) {
      this.setState({invalidEmail: true})
      return
    }

    this.setState({invalidEmail: false})

    this.zipStore.subscribe(this.state.email)
      .then(() => {
        this.setState({
          heroStatus: 'invalid_zip_success',
          heroText: 'Great! You\'ll be the first to know when we are in your zipcodes!',
          heroDescription: '',
        })
      })
  }

  handleStart(e) {
    const store = this.props.store
    store.modal.toggleSignup()
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

    return (
      <div className="homepage">
        <section id="nav-hero" className="landing-section aw-hero">
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
                        onChange={this.handleEmail}
                      />
                      {this.state.invalidEmail && <div className="text-error">Invalid email</div>}
                      <ButtonNotify/>
                    </div>
                }

                {this.state.heroStatus === 'success' && <ButtonStartShopping/>}
              </div>
            </div>
          </div>
        </section>

        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <h2>It's what's on the inside, that counts.</h2>
              <p>When did grocery shopping become more about the packaging than the food? At the Wally Shop we believe in
food that is yummy, fresh and responsibly sourced. Everything is either local or organic. Your groceries will be 
delivered to you in reusable paackaging that can be returned conveniently upon any future deliveries. Enjoy the 
freshest groceries, at bulk prices, completely package-free. 
</p>
            </div>

            <div className="row">
              <div className="col-md-12 mb-md-4">
                <div className="row">
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home1_1.png" alt=""/>
                      <h4>BUY THE PRODUCT, <br/>NOT THE PACKAGING</h4>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home2_1.png" alt=""/>
                      <h4>BULK PRICES, <br/>INDIVIDUAL SIZES</h4>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-4">
                    <div className="howto-item">
                      <img src="images/home3_1.png" alt=""/>
                      <h4>CURATED SELECTION <br/>OF QUALITY INGREDIENTS</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br /><br />
          <div className="container">
            <h3>All available zipcodes</h3>
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
