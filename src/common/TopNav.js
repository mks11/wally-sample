import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { formatMoney, connect } from '../utils'
import ClickOutside from 'react-click-outside'

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.modalStore= this.props.store.modal
    this.userStore= this.props.store.user
    this.uiStore= this.props.store.ui
    this.routing = this.props.store.routing
  }

  handleLogin() {
    this.routing.push('/main')
    this.modalStore.toggleLogin()
  }

  handleSignup() {
    this.modalStore.toggleZip()
  }

  handleLogo() {
    this.props.store.routing.push('/')
  }

  handleInvite() {
    this.uiStore.hideAccountDropdown()
    this.modalStore.toggleInvite()
    this.userStore.referFriend()
  }

  handleLogout(e) {
    this.uiStore.hideAccountDropdown()
    this.props.store.routing.push('/')
    this.userStore.logout()
    e.preventDefault()
  }

  handleToggle = () => {
    this.uiStore.toggleAccountDropdown()
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
    return (
      <div className="header-wrap">
        <div className="aw-nav--mobile d-md-none">
          <div className="center-middle">
            <div className="container-fluid">
              <div className="row aw-nav--middle">
                <div className="col-12">
                  <nav className="navbar d-block">
                    <ul className="aw-nav--menu m-0 p-0 text-center">
                      <li><Link to="/about">About</Link></li>
                      <li><Link to="/help">Help</Link></li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="row aw-nav--action">
                <div className="col-12 text-center">
                  <a href="#nav-hero" className="btn btn-block mx-auto btn-outline-white btn-get--started d-inline-block d-md-block">Get notified</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <header className="aw-header navbar-white">
          <div className="container-fluid full-width">
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
                        <button onClick={this.handleToggle} className="btn btn-transparent dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">
                          Hello {name}
                        </button>
                        <div className={dropdownClass} aria-labelledby="dropdownMenuButton">
                          <a className="dropdown-item lg" href="#"><strong>All About You..</strong></a>
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
                    { this.userStore.status ? 
                        <li><a className="nav-link aw-nav--link p-0">Store Credit ({formatMoney(storeCredit)})</a></li>
                        :null
                    }
                    <li><Link className="nav-link aw-nav--link p-0" to="/about">About</Link></li>
                    <li><Link className="nav-link aw-nav--link p-0" to="/help">Help</Link></li>
                  </ul>
                </nav>
              </div>
              { !this.userStore.status ? 
              <div className="col-auto d-none d-lg-block btn-top-account">
                <button onClick={e => this.handleLogin(e)} className="btn btn-outline-black btn-login"><b>Login</b></button>
                <button onClick={e => this.handleSignup(e)} className="btn btn-inline-black btn-sign-up"><b>Sign up</b></button>
              </div>
                  : null}
              <button className="navbar-toggler aw-nav--toggle d-md-none" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
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
