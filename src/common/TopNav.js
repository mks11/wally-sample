import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { formatMoney, connect, logEvent, logModalView, logPageView } from '../utils'
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
    logModalView('/login')
    this.routing.push('/main')
    this.modalStore.toggleModal('login')
  }

  handleSignup() {
    logModalView('/signup-zip')
    this.routing.push('/main')
    this.modalStore.toggleModal('zip')
  }

  handleLogo() {
    this.props.store.routing.push('/main')
  }

  handleInvite() {
    logModalView('/refer')
    this.uiStore.hideAccountDropdown()
    // this.modalStore.toggleModal('invite')
    this.modalStore.toggleModal('referral')
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

  handleCloseTopBar = (e) => {
    this.uiStore.closeTopBar()
    e.preventDefault()
  }

  handleReferralModal = (e) => {
    if (this.userStore.user) {
      logModalView('/refer')
      this.modalStore.toggleModal('referral')
    } else {
      this.routing.push("/help/detail/5c3d0df2fc84ff404f3b9eca")
    }
    e.preventDefault()
  }

  render() {
    let storeCredit, name
    let isAdmin = false
    let isTwsOps = false
    let bannerText = "Hello, Manhattan! 🎉 Wally now available in select Manhattan zip codes, click for details."
    if (this.userStore.user) {
      bannerText = "Give $10, get $10 when you refer a friend. Click for details."
      !this.userStore.user.name && this.userStore.setUserData(null)
      const user = this.userStore.user
      storeCredit =  user.store_credit
      name = user.name.split(' ')[0]
      isAdmin = user.type === 'admin' || user.type === 'super-admin'
      isTwsOps = user.type === 'tws-ops'
    } else {
      storeCredit = 0
    }
    console.log("Admin is", isAdmin);

    let dropdownClass = 'dropdown-menu dropdown-menu-right profile-dropdown'
    if (this.uiStore.accountDropdown) {
      dropdownClass += ' show'
    }

    let headerWrapClass = 'header-wrap'
    if (this.uiStore.navMobile) {
      headerWrapClass += ' nav-open'
    }


    let topBarClass = 'top-bar d-none'
    if (this.uiStore.topBar) {
      topBarClass = 'top-bar'
      headerWrapClass += ' top-bar-open'
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
                        isAdmin ?
                          //
                          <React.Fragment>
                            <li><a style={{fontSize: '15px'}}><strong>Hello {name}</strong></a></li>
                            <li><a>Store Credit ({formatMoney(storeCredit/100)})</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/orders')}>Order History</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/user')}>Account Settings</a></li>
                            <li><a onClick={this.handleMobileNavInvite}>Give $10, Get $10</a></li>
                            <li><a onClick={this.handleMobileNavLogout}>Sign Out</a></li>
                          </React.Fragment>
                          //
                          :
                          <React.Fragment>
                            <li><a style={{fontSize: '15px'}}><strong>Hello {name}</strong></a></li>
                            <li><a>Store Credit ({formatMoney(storeCredit/100)})</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/orders')}>Order History</a></li>
                            <li><a onClick={this.handleNavMobile.bind(this, '/user')}>Account Settings</a></li>
                            <li><a onClick={this.handleMobileNavInvite}>Give $10, Get $10</a></li>
                            <li><a onClick={this.handleMobileNavLogout}>Sign Out</a></li>
                          </React.Fragment>
                          :
                          <React.Fragment>
                            <li><a onClick={this.handleMobileNavLogin}>Log In</a></li>
                            <li><a onClick={this.handleMobileNavSignUp}>Sign Up</a></li>
                          </React.Fragment>
                      }

                      <li className="mt-5"><a onClick={this.handleNavMobile.bind(this, '/about')}>About</a></li>
                      <li><a onClick={this.handleNavMobile.bind(this, '/howitworks')}>How It Works</a></li>
                      <li><a onClick={this.handleNavMobile.bind(this, '/blog')}>Blog</a></li>
                      <li><a onClick={this.handleNavMobile.bind(this, '/help')}>Help</a></li>
                      <li><a onClick={this.handleNavMobile.bind(this, '/giftcard')}>Gift Card</a></li>
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
        <header className={`aw-header navbar-white ${isAdmin ? 'admin-navbar' : ''}`}>
          {
          ((this.userStore.status && !isAdmin) || !this.userStore.status) ? (
            <div className={topBarClass}>
              <div className="container">
                <div onClick={this.handleReferralModal}>
                  {bannerText}
                </div>
                <button className="close-top-bar" onClick={this.handleCloseTopBar}>
                  <i className="fa fa-times-circle" aria-hidden="true" ></i>
                </button>
              </div>
            </div>
            ) : null
          }
          <div className="container">
            <div className="row align-items-center mobile-top-nav top-nav">
              <div className="col-auto">
                <a className="aw-logo d-block text-center" onClick={e => this.handleLogo(e)}>
                  <img className="logo-text-desktop" src='/images/text-logo.svg' alt="" />
                  <img className="logo-text-mobile" src='/images/text-logo.svg' alt="" />
                </a>
              </div>
              <div className="col-auto ml-auto d-none d-md-block">
                <nav id="main-nav" className="navbar px-0 aw-nav text-center">
                  <ul className="nav m-0 p-0" role="tablist">
                    { this.userStore.status ?
                      isAdmin ? (
                        <li>
                          <div className="col-auto ml-auto d-none d-md-block account-dropdown">
                            <ClickOutside onClickOutside={e => this.uiStore.hideAccountDropdown()}>
                              <div className="btn-group">
                                <button onClick={this.handleToggle} className="btn btn-transparent text-bold" type="button" data-toggle="dropdown" aria-expanded="true">
                                  <span className="navbar-toggler-icon account-icon"></span>
                                </button>
                                <div className={dropdownClass} aria-labelledby="dropdownMenuButton">
                                  <span className="dropdown-item lg"><strong>Hi {name}</strong></span>
                                      <Link onClick = {e=>this.uiStore.hideAccountDropdown()} to="/manage/shopper" className="dropdown-item">Shopper</Link>
                                      <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/packaging" className="dropdown-item">Packaging</Link>
                                      <Link onClick={e=>this.uiStore.hideAccountDropdown()} to="/manage/delivery" className="dropdown-item">Delivery</Link>
                                      <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/blog" className="dropdown-item">Blog</Link>
                                      <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/shopping-app-1" className="dropdown-item">Shopping App</Link>
                                      <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/orders" className="dropdown-item">Packaging App</Link>
                                      <a onClick={e => this.handleLogout(e)} className="dropdown-item">Sign Out</a>
                                </div>
                              </div>
                            </ClickOutside>
                          </div>
                        </li>
                      ) : isTwsOps ? (
                        <li>
                          <div className="col-auto ml-auto d-none d-md-block account-dropdown">
                            <ClickOutside onClickOutside={e => this.uiStore.hideAccountDropdown()}>
                              <div className="btn-group">
                                <button onClick={this.handleToggle} className="btn btn-transparent text-bold" type="button" data-toggle="dropdown" aria-expanded="true">
                                  <span className="navbar-toggler-icon account-icon"></span>
                                </button>
                                <div className={dropdownClass} aria-labelledby="dropdownMenuButton">
                                  <span className="dropdown-item lg"><strong>Hi {name}</strong></span>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/shopping-app-1" className="dropdown-item">Shopping App</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/manage/orders" className="dropdown-item">Packaging App</Link>
                                    <a onClick={e => this.handleLogout(e)} className="dropdown-item">Sign Out</a>
                                </div>
                              </div>
                            </ClickOutside>
                          </div>
                        </li>
                      ) : (
                        <div className="col-auto ml-auto d-none d-md-block account-dropdown">
                          <ClickOutside onClickOutside={e => this.uiStore.hideAccountDropdown()}>
                            <div className="btn-group">
                              <button onClick={this.handleToggle} className="btn btn-transparent text-bold" type="button" data-toggle="dropdown" aria-expanded="true">
                                <span className="navbar-toggler-icon account-icon"></span>
                              </button>
                              <div className={dropdownClass} aria-labelledby="dropdownMenuButton">
                                <span className="dropdown-item lg"><strong>Hi {name}</strong></span>
                                    <a className="dropdown-item">Store Credit ({formatMoney(storeCredit / 100)})</a>
                                    <Link onClick = {e=>this.uiStore.hideAccountDropdown()} to="/orders" className="dropdown-item">Order History</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/user" className="dropdown-item">Account Settings</Link>
                                    <a onClick={e => this.handleInvite(e)} className="dropdown-item">Give $10, get $10</a>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/about" className="dropdown-item">About</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/howitworks" className="dropdown-item">How It Works</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/blog" className="dropdown-item">Blog</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/help" className="dropdown-item">Help</Link>
                                    <Link onClick={e => this.uiStore.hideAccountDropdown()} to="/giftcard" className="dropdown-item">Gift Card</Link>
                                    <a onClick={e => this.handleLogout(e)} className="dropdown-item">Sign Out</a>
                              </div>
                            </div>
                          </ClickOutside>
                        </div>
                      ) : (
                        <React.Fragment>
                          <li><Link className="nav-link aw-nav--link p-0" to="/about">About</Link></li>
                          <li><Link className="nav-link aw-nav--link p-0" to="/howitworks">How It Works</Link></li>
                          <li><Link className="nav-link aw-nav--link p-0" to="/blog">Blog</Link></li>
                          <li><Link className="nav-link aw-nav--link p-0" to="/help">Help</Link></li>
                          <li><Link className="nav-link aw-nav--link p-0" to="/giftcard">Gift Card</Link></li>
                        </React.Fragment>
                      )
                    }
                  </ul>
                </nav>
              </div>
              { !this.userStore.status ? 
              <div className="col-auto d-none d-md-block btn-top-account">
                <button onClick={e => this.handleLogin()} className="btn btn-outline-black btn-login text-caps"><b>Log in</b></button>
                <button onClick={e => this.handleSignup()} className="btn btn-inline-black btn-sign-up text-caps"><b>Sign up</b></button>
              </div>
                  : null}

                  { this.userStore.status ? 
                      <button onClick={e=> this.uiStore.toggleNavMobile()} className="navbar-toggler aw-nav--toggle d-md-none" type="button" >
                        <span className="navbar-toggler-icon"></span>
                      </button>
                    :
                      <button onClick={e=>this.handleLogin()} className="btn btn-outline-black btn-login text-caps d-md-none d-lg-none"><b>Login</b></button>
                    }

            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default connect("store")(TopNav);
