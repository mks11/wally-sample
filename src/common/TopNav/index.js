// Node Modules
import React, { Component } from 'react';
import moment from 'moment';

// Utilities
import { logModalView } from 'services/google-analytics';
import { connect } from '../../utils';

// Components
import ClickOutside from 'react-click-outside';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import ToggleIcon from 'common/ToggleIcon';

// Styles
import styles from './TopNav.module.css';

// Nav Menus
import { MobileGuestNav, DesktopGuestNav } from 'common/TopNav/GuestNav';
import { MobileUserNav, DesktopUserNav } from 'common/TopNav/UserNav';
import { MobileOpsNav, DesktopOpsNav } from 'common/TopNav/OpsNav';
import { MobileAdminNav, DesktopAdminNav } from 'common/TopNav/AdminNav';

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.modalStore = this.props.store.modal;
    this.userStore = this.props.store.user;
    this.checkoutStore = this.props.store.checkout;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.productStore = this.props.store.product;
    this.userStore.getStatus();
  }

  handleLogin = () => {
    logModalView('/login');
    this.routing.push('/main');
    this.modalStore.toggleModal('login');
  };

  handleSignup = () => {
    logModalView('/signup-zip');
    this.routing.push('/main');
    this.modalStore.toggleModal('signup');
  };

  handleLogo = (e) => {
    if (this.userStore.user) {
      this.props.store.routing.push('/main');
      this.productStore.resetSearch();
    } else {
      this.props.store.routing.push('/');
    }
    e.preventDefault();
  };

  handleInvite = () => {
    logModalView('/refer');
    this.hideAccountDropdown();
    this.modalStore.toggleModal('referral');
  };

  handleLogout = () => {
    this.checkoutStore.cart = null;
    this.checkoutStore.order = null;
    this.hideAccountDropdown();
    this.props.store.routing.push('/');
    this.userStore.logout();
  };

  handleToggle = () => {
    this.uiStore.toggleAccountDropdown();
  };

  handleNavMobile = (link) => {
    this.routing.push(link);
    this.uiStore.hideNavMobile();
  };

  hideNavMobile = () => {
    this.uiStore.hideNavMobile();
  };

  handleMobileNavLogin = () => {
    this.uiStore.hideNavMobile();
    this.handleLogin();
  };

  handleMobileNavSignUp = () => {
    this.uiStore.hideNavMobile();
    this.handleSignup();
  };

  handleMobileNavInvite = () => {
    this.uiStore.hideNavMobile();
    this.handleInvite();
  };

  handleMobileNavLogout = () => {
    this.uiStore.hideNavMobile();
    this.handleLogout();
  };

  handleCloseTopBar = (e) => {
    this.uiStore.closeTopBar();
    e.preventDefault();
  };

  /** Schedule Pickup */
  handleMobileNavSchedulePickup = () => {
    this.uiStore.hideNavMobile();
    this.handleSchedulePickup();
  };

  handleSchedulePickup = () => {
    logModalView('/schedulePickup');
    this.hideAccountDropdown();
    this.modalStore.toggleModal('schedulepickup');
  };

  handleReferralModal = (e) => {
    if (this.userStore.user) {
      logModalView('/refer');
      this.modalStore.toggleModal('referral');
    } else {
      this.routing.push('/help/detail/5c3d0df2fc84ff404f3b9eca');
    }
  };

  handleBannerClick = (e) => {
    this.routing.push('/latest-news');
  };

  hideAccountDropdown = () => {
    this.uiStore.hideAccountDropdown();
  };

  handleNavBackers = () => {
    this.props.store.routing.push('/backers');
  };

  handleMobileNavBackers = () => {
    this.uiStore.hideNavMobile();
    this.handleNavBackers();
  };

  handleRedeemDepositClick = () => {
    this.hideAccountDropdown();
    this.modalStore.toggleModal('redeemdeposit');
  };

  render() {
    const isLoggedIn = this.userStore.status;
    const { isAdmin, isOpsLead, isUser, isOps } = this.userStore;
    let storeCredit, name;
    let bannerText =
      'We’re working hard to restock - try next week if you don’t see something!';

    if (this.userStore.user) {
      !this.userStore.user.name && this.userStore.setUserData(null);
      const user = this.userStore.user;
      storeCredit = user.packaging_balance;
      name = user.name.split(' ')[0];
    } else {
      storeCredit = 0;
    }

    let dropdownClass = 'dropdown-menu dropdown-menu-right profile-dropdown';
    if (this.uiStore.accountDropdown) {
      dropdownClass += ' show';
    }

    let headerWrapClass = 'header-wrap';
    if (this.uiStore.navMobile) {
      headerWrapClass += ' nav-open';
    }

    let topBarClass = 'top-bar d-none';
    if (isUser && this.uiStore.topBar) {
      topBarClass = 'top-bar';
      headerWrapClass += ' top-bar-open';
    }

    const isHomePage = this.routing.location.pathname === '/';
    const isProductPage = this.routing.location.pathname.includes('/main');

    return (
      <div className={headerWrapClass}>
        {/* // Mobile Nav Modal */}
        <div className="aw-nav--mobile d-lg-none">
          <div className="center-middle">
            <div className="container-fluid">
              <div className="row aw-nav--middle">
                <div className="col-12">
                  <nav className="navbar d-block">
                    <ul className="aw-nav--menu m-0 p-0 text-center">
                      {/* ADMIN */}
                      {this.userStore.status && isAdmin && (
                        <MobileAdminNav
                          hideNav={this.hideNavMobile}
                          handleSignout={this.handleMobileNavLogout}
                          userName={name}
                        />
                      )}

                      {/* OPS */}
                      {this.userStore.status && (isOps || isOpsLead) && (
                        <MobileOpsNav
                          hideNav={this.hideNavMobile}
                          handleSignout={this.handleMobileNavLogout}
                          userName={name}
                          isOpsLead={isOpsLead}
                        />
                      )}

                      {/* USER */}
                      {this.userStore.status && isUser && (
                        <MobileUserNav
                          hideNav={this.hideNavMobile}
                          handleSignout={this.handleMobileNavLogout}
                          handleSchedulePickup={
                            this.handleMobileNavSchedulePickup
                          }
                          userName={name}
                          userStoreCredit={storeCredit}
                        />
                      )}

                      {/* GUEST */}
                      {!this.userStore.status && (
                        <MobileGuestNav
                          hideNav={this.hideNavMobile}
                          handleLogin={this.handleMobileNavLogin}
                          handleSignup={this.handleMobileNavSignUp}
                        />
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <header
          className={`aw-header navbar-white ${
            isAdmin || isOps ? 'admin-navbar' : ''
          } ${isHomePage ? '' : 'util-bg-color-white'} ${
            isProductPage ? ' aw-absolute' : ''
          }`}
        >
          {/* Banner that Only guests and users should see */}
          {(this.userStore.status && isUser) || !this.userStore.status ? (
            <div className={topBarClass}>
              <div className="container">
                <div onClick={this.handleBannerClick}>
                  {bannerText}
                  <button
                    className="close-top-bar"
                    onClick={this.handleCloseTopBar}
                  >
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Desktop Nav */}
          <div className="container">
            <div className="row align-items-center mobile-top-nav top-nav">
              <DesktopLogo onClick={this.handleLogo} />
              <div className="col-auto ml-auto d-none d-lg-block">
                <nav id="main-nav" className="navbar px-0 aw-nav text-center">
                  {/* Check if the user is logged in, then check their role. */}
                  {isLoggedIn ? (
                    <div className="col-auto ml-auto d-none d-lg-block account-dropdown">
                      <ClickOutside onClickOutside={this.hideAccountDropdown}>
                        <div className="btn-group">
                          {isUser && (
                            <Link
                              className="nav-link aw-nav--link util-font-size-14"
                              to="/help"
                            >
                              Help
                            </Link>
                          )}
                          {(isOps || isOpsLead) && (
                            <Typography
                              variant="body2"
                              style={{ marginRight: '1.25rem' }}
                            >
                              {/* ex: July 6th, 2020 */}
                              {moment().local().format('MMMM Do, YYYY')}
                            </Typography>
                          )}
                          <button
                            onClick={this.handleToggle}
                            className="btn btn-transparent"
                            type="button"
                            data-toggle="dropdown"
                            aria-expanded="true"
                          >
                            <span>
                              Hello {name}{' '}
                              <i
                                className="fa fa-caret-down"
                                aria-hidden="true"
                              >
                                {' '}
                              </i>
                            </span>
                          </button>
                          <div
                            className={dropdownClass}
                            aria-labelledby="dropdownMenuButton"
                          >
                            <Grid
                              container
                              direction="column"
                              role="tablist"
                              component="ul"
                              style={{ paddingLeft: 0, marginBottom: 0 }}
                            >
                              {isAdmin && (
                                <DesktopAdminNav
                                  handleSignout={this.handleLogout}
                                  hideDropdown={this.hideAccountDropdown}
                                />
                              )}

                              {isUser && (
                                <DesktopUserNav
                                  balance={storeCredit}
                                  handleRedeemDeposit={
                                    this.handleRedeemDepositClick
                                  }
                                  handleSchedulePickup={
                                    this.handleSchedulePickup
                                  }
                                  handleSignout={this.handleLogout}
                                  hideDropdown={this.hideAccountDropdown}
                                />
                              )}

                              {(isOps || isOpsLead) && (
                                <DesktopOpsNav
                                  hideDropdown={this.hideAccountDropdown}
                                  handleSignout={this.handleLogout}
                                />
                              )}
                            </Grid>
                          </div>
                        </div>
                      </ClickOutside>
                    </div>
                  ) : (
                    <DesktopGuestNav
                      handleLogin={this.handleLogin}
                      handleSignup={this.handleSignup}
                      handleBackers={this.handleNavBackers}
                    />
                  )}
                </nav>
              </div>
              <MobileNavbar uiStore={this.uiStore} />
            </div>
            <MobileLogo onClick={this.handleLogo} />
          </div>
        </header>
      </div>
    );
  }
}

export default connect('store')(TopNav);

function DesktopLogo({ onClick }) {
  return (
    <div className="d-none col-auto d-md-block">
      <a className="aw-logo d-flex align-items-center" onClick={onClick}>
        <img
          className={styles.logo}
          src="/images/TheWallyShop_Logo_Horizontal.svg"
          alt="The Wally Shop"
        />
      </a>
    </div>
  );
}

function MobileLogo({ onClick }) {
  return (
    <div className="row d-md-none d-sm-block">
      <div className="col-sm-12">
        <a
          className="aw-logo d-flex align-items-center justify-content-center"
          onClick={onClick}
        >
          <img
            className={`${styles.logo} util-relative util-offset-top--30`}
            src="/images/TheWallyShop_Logo_Horizontal.svg"
            alt="The Wally Shop"
          />
        </a>
      </div>
    </div>
  );
}

function MobileNavbar({ uiStore }) {
  return (
    <button
      onClick={(e) => uiStore.toggleNavMobile()}
      className="navbar-toggler d-md-none"
      type="button"
    >
      <ToggleIcon isOpen={uiStore.navMobile} />
    </button>
  );
}
