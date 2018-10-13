import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { validateEmail, connect } from '../utils'
import { APP_URL, INSTAGRAM, FACEBOOK} from '../config'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }

    this.zipStore = this.props.store.zip
    this.modalStore = this.props.store.modal
  }
  
  handleSubscribe() {
    if (!validateEmail(this.state.email)) {
      this.setState({invalidEmail: true})
      return
    }

    this.setState({invalidEmail: false})

    this.zipStore.subscribe(this.state.email)
      .then(() => {
        this.modalStore.toggleInvalidZipSuccess()
      })
  }
  render() {
    return (
      <footer className="aw-footer bg-darkblue">
        <div className="container">
          <div className="row">
            <div className="col-auto col-sm-2">
              <a href="/">
                <img className="footer-logo" src={"/images/logo.png"}/>
              </a>
            </div>
            <div className="col col-sm-10">
              <div className="row">
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    THE WALLY SHOP
                  </h4>
                  <ul>
                      <li><Link to="about">ABOUT</Link></li>
                      <li><Link to="help">HELP</Link></li>
                  </ul>

                </div>
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    SUPPORT
                  </h4>
                  <ul>
                    <li><a href="mailto:support@thewallyshop.co">CONTACT US</a></li>
                    <li><Link to={"/tnc"} >TERMS &amp; CONDITIONS</Link></li> 
                    <li><Link to={"/privacy"} >PRIVACY POLICY</Link></li> 
                  </ul>

                </div>
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    FOLLOW US
                  </h4>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom">
            <div className="container">
              <form className="form-inline">
                <label htmlFor="subscribe-email">Subscribe to our newsletter</label>

                  <ul>
                    <li>
                      <ul className="aw-social mt-0 mx-2">
                        <li className="d-inline-block align-middle mr-3 footer-fb">
                          <a href={FACEBOOK} target="_blank">
                          </a>
                        </li>
                        <li className="d-inline-block align-middle footer-ig">
                          <a href={INSTAGRAM} target="_blank">
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                <div className="input-group">
                  <input type="email" id="subscribe-email" className="form-control" placeholder="Enter your email" onChange={e => this.setState({email: e.target.value})}/>
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button" id="btn-subscribe" onClick={e => this.handleSubscribe(e)}>Subscribe</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </footer>
    );
  }
}

export default connect("store")(Footer);
