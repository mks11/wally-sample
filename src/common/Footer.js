import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { validateEmail, connect } from '../utils'
import { INSTAGRAM, FACEBOOK} from '../config'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: ''
    }

    this.zipStore = this.props.store.zip
    this.userStore = this.props.store.user
  }
  
  handleSubscribe() {
    if (!validateEmail(this.state.email)) {
      this.setState({invalidText: 'Invalid email'})
      return
    }

    this.setState({invalidText: false})

    this.userStore.subscribeNewsletter(this.state.email).then(() => {
      this.setState({invalidText: '', successText: 'Subscribed!'})
      setTimeout(() => {
        this.setState({successText: ''})
      }, 1500)
    }).catch((e) => {
      this.setState({invalidText: 'Failed to subscribe'})
    })
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value, invalidText: ''})

  }
  render() {
    let isAdmin = false
    if (this.userStore.user) {
      const user = this.userStore.user
      isAdmin = user.type === 'admin'
    }
    if (isAdmin) return null
    return (
      <footer className="aw-footer bg-darkblue">
        <div className="container">
          <div className="row">
            <div className="col-auto col-sm-2">
              <a href="/">
                <img className="footer-logo" src={"/images/logo.png"} alt="" />
              </a>
            </div>
            <div className="col col-sm-10">
              <div className="row">
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    THE WALLY SHOP
                  </h4>
                  <ul>
                      <li><Link to="about">About</Link></li>
                      <li><Link to="howitworks">How It Works</Link></li>
                      <li><Link to="blog">Blog</Link></li>
                      <li><Link to="help">Help</Link></li>
                  </ul>

                </div>
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    SUPPORT
                  </h4>
                  <ul>
                    <li><a href="mailto:info@thewallyshop.co">Contact Us</a></li>
                    <li><Link to={"/tnc"} >Terms &amp; Conditions</Link></li> 
                    <li><Link to={"/privacy"} >Privacy Policy</Link></li> 
                  </ul>

                </div>
                <div className="col-sm-4">
                  <h4 className="aw-footer--title">
                    FOLLOW US
                  </h4>
                  <ul>
                    <li>@thewallyshop</li>
                    <li>
                      <ul className="aw-social mt-2">
                        <li className="d-inline-block align-middle footer-fb">
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

                
                 </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="footer-bottom bg-darkblue">
            <div className="container">
              <form className="form-inline" style={{position: 'relative'}}>
                <label htmlFor="subscribe-email">Subscribe to our newsletter</label>
                <div className="input-group">
                  <input type="email" id="subscribe-email" className="form-control" placeholder="Enter your email" onChange={this.handleEmailChange}/>
                    <div className="input-group-append">
                      <button className="btn btn-primary" type="button" id="btn-subscribe" onClick={e => this.handleSubscribe(e)}>Subscribe</button>
                    </div>
                  </div>
                  {this.state.invalidText ? <span className="text-error  d-block ml-2 mt-0 p-0 footer-message">{this.state.invalidText}</span>:null}
                  {this.state.successText ? <span className="text-green  d-block ml-2 mt-0 p-0 footer-message">{this.state.successText}</span>:null}
                </form>
              </div>
            </div>
          </div>
      </footer>
    );
  }
}

export default connect("store")(Footer);
