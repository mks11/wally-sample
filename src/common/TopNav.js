import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { formatMoney, connect } from '../utils'
import ClickOutside from 'react-click-outside'

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.modalStore= this.props.store.modal
    this.userStore= this.props.store.user
    this.checkoutStore= this.props.store.checkout
    this.uiStore= this.props.store.ui
    this.routing = this.props.store.routing
  }

  handleLogin() {
    this.routing.push('/main')
    this.modalStore.toggleLogin()
  }

  handleSignup() {
    this.routing.push('/main')
    this.modalStore.toggleZip()
  }

  handleLogo() {
    this.props.store.routing.push('/main')
  }

  handleInvite() {
    this.uiStore.hideAccountDropdown()
    this.modalStore.toggleInvite()
    this.userStore.referFriend()
  }

  handleLogout() {
    this.checkoutStore.cart = null
    this.checkoutStore.order = null
    this.uiStore.hideAccountDropdown()
    this.props.store.routing.push('/')
    this.userStore.logout()
    // e.preventDefault()
  }

  handleToggle = () => {
    this.uiStore.toggleAccountDropdown()
  }

  handleNavMobile = (link) => {
    this.routing.push(link)
    this.uiStore.hideNavMobile()
  }

  handleMobileNavLogin = () => {
    this.uiStore.hideNavMobile()
    this.handleLogin()
  }

  handleMobileNavSignUp = () => {
    this.uiStore.hideNavMobile()
    this.handleSignup()
  }

  handleMobileNavInvite = () => {
    this.uiStore.hideNavMobile()
    this.handleInvite()
  }

  handleMobileNavLogout = () => {
    this.uiStore.hideNavMobile()
    this.handleLogout()
  }

  render() {
    let storeCredit, name
    if (this.userStore.user) {
      !this.userStore.user.name && this.userStore.setUserData(null)
      const user = this.userStore.user
      storeCredit =  user.store_credit
      name = user.name.split(' ')[0]
    } else {
      storeCredit = 0
    }

    let dropdownClass = 'dropdown-menu dropdown-menu-right'
    if (this.uiStore.accountDropdown) {
      dropdownClass += ' show'
    }

    let headerWrapClass = 'header-wrap'
    if (this.uiStore.navMobile) {
      headerWrapClass += ' nav-open'
    }
    return (
      <div className={headerWrapClass}>
        <div className="aw-nav--mobile d-md-none">
          <div className="center-middle">
            <div className="container-fluid">
              <div className="row aw-nav--middle">
                <div className="col-12">
                  <nav className="navbar d-block">
                    <ul className="aw-nav--menu m-0 p-0 text-center">

                      { this.userStore.status ?
                          <React.Fragment>
                            <li><a style={{fontSize: '15px'}}><strong>Hello {name}</strong></a></li>
                            <li><a>Store Credit ({formatMoney(storeCredit/100)})</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/orders')}>Order History</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/user')}>Account Settings</a></li>
                            <li><a onClick={this.handleMobileNavInvite}>Invite Friends</a></li>
                            <li><a onClick={this.handleMobileNavLogout}>Sign Out</a></li>
                          </React.Fragment>
                          :
                          <React.Fragment>
                            <li><a onClick={this.handleMobileNavLogin}>Login</a></li>
                            <li><a onClick={this.handleMobileNavSignUp}>Sign Up</a></li>
                          </React.Fragment>
                      }

                      <li className="mt-5"><a onClick={this.handleNavMobile.bind(this, '/about')}>About</a></li>
                      <li><a onClick={this.handleNavMobile.bind(this, '/help')}>Help</a></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="row aw-nav--action">
                <div className="col-12 text-center">
                  {/* 
                  <a href="#nav-hero" className="btn btn-block mx-auto btn-outline-white btn-get--started d-inline-block d-md-block">Get notified</a>
                      */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <header className="aw-header navbar-white">
          <div className="container">
            <div className="row align-items-center mobile-top-nav">
              <div className="col-auto">
                <a className="aw-logo d-block" onClick={e => this.handleLogo(e)}>
                  <img className="logo-text-desktop" src='/images/text-logo.png'/>
                  <img className="logo-text-mobile" src='/images/logo.png'/>
                </a>
              </div>
              { this.userStore.status ? 
                  <div className="col-auto ml-auto d-none d-md-block account-dropdown">
                    <ClickOutside onClickOutside={e => this.uiStore.hideAccountDropdown()}>
                      <div className="btn-group">
                        <button onClick={this.handleToggle} className="btn btn-transparent dropdown-toggle text-bold" type="button" data-toggle="dropdown" aria-expanded="true">
                          <strong>Hello {name}</strong>
                        </button>
                        <div className={dropdownClass} aria-labelledby="dropdownMenuButton">
                          <a className="dropdown-item lg" href="#"><strong>All About You..</strong></a>
                          <a className="dropdown-item">Store Credit ({formatMoney(storeCredit/100)})</a>
                          <Link onClick={e=>this.uiStore.hideAccountDropdown()} to="/orders" className="dropdown-item" href="#">Order History</Link>
                          <Link onClick={e=>this.uiStore.hideAccountDropdown()} to="/user" className="dropdown-item" href="#">Account Settings</Link>
                          <a onClick={e => this.handleInvite(e)} className="dropdown-item">Invite Friends</a>
                          <a onClick={e => this.handleLogout(e)} className="dropdown-item">Sign Out</a>
                        </div>
                      </div>
                      </ClickOutside>
                </div>
                  :null}
              <div className="col-auto ml-auto d-none d-md-block">
                <nav id="main-nav" className="navbar px-0 aw-nav text-center">
                  <ul className="nav m-0 p-0" role="tablist">
                    <li><Link className="nav-link aw-nav--link p-0" to="/about">About</Link></li>
                    <li><Link className="nav-link aw-nav--link p-0" to="/help">Help</Link></li>
                  </ul>
                </nav>
              </div>
              { !this.userStore.status ? 
              <div className="col-auto d-none d-lg-block btn-top-account">
                <button onClick={e => this.handleLogin()} className="btn btn-outline-black btn-login text-caps"><b>Login</b></button>
                <button onClick={e => this.handleSignup()} className="btn btn-inline-black btn-sign-up text-caps"><b>Sign up</b></button>
              </div>
                  : null}
                  <button onClick={e=> this.uiStore.toggleNavMobile()} className="navbar-toggler aw-nav--toggle d-md-none" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default connect("store")(TopNav);
