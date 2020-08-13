import React, { Component } from "react";
import { Link } from "react-router-dom";
import ClickOutside from "react-click-outside";

import { logModalView } from "services/google-analytics";
import { formatMoney, connect } from "../../utils";

// Nav Menus
import { MobileGuestNav, DesktopGuestNav } from "common/TopNav/GuestNav";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.modalStore = this.props.store.modal;
    this.userStore = this.props.store.user;
    this.checkoutStore = this.props.store.checkout;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.productStore = this.props.store.product;
  }

  handleLogin = () => {
    logModalView("/login");
    this.routing.push("/main");
    this.modalStore.toggleModal("login");
  };

  handleSignup = () => {
    logModalView("/signup-zip");
    this.routing.push("/main");
    this.modalStore.toggleModal("signup");
  };

  handleLogo = (e) => {
    if (this.userStore.user) {
      this.props.store.routing.push("/main");
      this.productStore.resetSearch();
    } else {
      this.props.store.routing.push("/");
    }
    e.preventDefault();
  };

  handleInvite = () => {
    logModalView("/refer");
    this.hideAccountDropdown();
    this.modalStore.toggleModal("referral");
  };

  handleLogout = () => {
    this.checkoutStore.cart = null;
    this.checkoutStore.order = null;
    this.hideAccountDropdown();
    this.props.store.routing.push("/");
    this.userStore.logout();
  };

  handleToggle = () => {
    this.uiStore.toggleAccountDropdown();
  };

  handleNavMobile = (link) => {
    this.routing.push(link);
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
    logModalView("/schedulePickup");
    this.hideAccountDropdown();
    this.modalStore.toggleModal("schedulepickup");
  };

  handleReferralModal = (e) => {
    if (this.userStore.user) {
      logModalView("/refer");
      this.modalStore.toggleModal("referral");
    } else {
      this.routing.push("/help/detail/5c3d0df2fc84ff404f3b9eca");
    }
  };

  handleBannerClick = (e) => {
    this.routing.push("/latest-news");
  };

  hideAccountDropdown = () => {
    this.uiStore.hideAccountDropdown();
  };

  handleNavBackers = () => {
    this.props.store.routing.push("/backers");
  };

  handleMobileNavBackers = () => {
    this.uiStore.hideNavMobile();
    this.handleNavBackers();
  };

  handleRedeemDepositClick = () => {
    this.hideAccountDropdown();
    this.modalStore.toggleModal("redeemdeposit");
  };

  render() {
    let storeCredit, name;
    const { isAdmin, isOpsLead, isUser, isOps } = this.userStore;
    const { hideNavMobile } = this.uiStore;
    let bannerText =
      "We’re working hard to restock - try next week if you don’t see something!";

    if (this.userStore.user) {
      !this.userStore.user.name && this.userStore.setUserData(null);
      const user = this.userStore.user;
      storeCredit = user.packaging_balance;
      name = user.name.split(" ")[0];
    } else {
      storeCredit = 0;
    }

    let dropdownClass = "dropdown-menu dropdown-menu-right profile-dropdown";
    if (this.uiStore.accountDropdown) {
      dropdownClass += " show";
    }

    let headerWrapClass = "header-wrap";
    if (this.uiStore.navMobile) {
      headerWrapClass += " nav-open";
    }

    let topBarClass = "top-bar d-none";
    if (this.uiStore.topBar) {
      topBarClass = "top-bar";
      headerWrapClass += " top-bar-open";
    }

    const isHomePage = this.routing.location.pathname === "/";
    const isProductPage = this.routing.location.pathname.includes("/main");

    return (
      <div className={headerWrapClass}>
        <div className="aw-nav--mobile d-lg-none">
          <div className="center-middle">
            <div className="container-fluid">
              <div className="row aw-nav--middle">
                <div className="col-12">
                  <nav className="navbar d-block">
                    <ul className="aw-nav--menu m-0 p-0 text-center">
                      {this.userStore.status && isAdmin && (
                        <React.Fragment>
                          <li>
                            <a style={{ fontSize: "15px" }}>
                              <strong>Hello {name}</strong>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/shopper")
                              }
                            >
                              Shopper
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/packaging")
                              }
                            >
                              Packing
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/delivery")
                              }
                            >
                              Delivery
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/courier-routing")
                              }
                            >
                              Courier Routing
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/shopping-app-1")
                              }
                            >
                              Shopping App
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/orders")
                              }
                            >
                              Packing App
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/products")
                              }
                            >
                              Products App
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/shipping")
                              }
                            >
                              Shipping
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/printing")
                              }
                            >
                              Printing
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/blog")
                              }
                            >
                              Blog
                            </a>
                          </li>
                          <li>
                            <a onClick={this.handleMobileNavLogout}>Sign Out</a>
                          </li>
                        </React.Fragment>
                      )}

                      {this.userStore.status && (isOps || isOpsLead) && (
                        <React.Fragment>
                          <li>
                            <a style={{ fontSize: "15px" }}>
                              <strong>Hello {name}</strong>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/shopping-app-1")
                              }
                            >
                              Shopping App
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/orders")
                              }
                            >
                              Packing App
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/pick-pack-returns")
                              }
                            >
                              Ops Portal
                            </a>
                          </li>
                          <li>
                            <a onClick={this.handleMobileNavLogout}>Sign Out</a>
                          </li>
                        </React.Fragment>
                      )}

                      {/* TODO COMBINE WITH OPS */}
                      {/* {this.userStore.status && isCopacker && (
                        <React.Fragment>
                          <li>
                            <a style={{ fontSize: "15px" }}>
                              <strong>Hello {name}</strong>
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile(
                                  "/manage/co-packing/inbound"
                                )
                              }
                            >
                              Inbound Shipment
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile(
                                  "/manage/co-packing/outbound"
                                )
                              }
                            >
                              Outbound Shipment
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/manage/co-packing/runs")
                              }
                            >
                              Co-packing
                            </a>
                          </li>
                          <li>
                            <a onClick={this.handleMobileNavLogout}>Sign Out</a>
                          </li>
                        </React.Fragment>
                      )} */}

                      {this.userStore.status && isUser && (
                        <React.Fragment>
                          <li>
                            <a style={{ fontSize: "15px" }}>
                              <strong>Hello {name}</strong>
                            </a>
                          </li>
                          <li>
                            <a>
                              Packaging Balance (
                              {formatMoney(storeCredit / 100)})
                            </a>
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/orders")}>
                              Order History
                            </a>
                          </li>
                          <li>
                            {" "}
                            <a onClick={this.handleMobileNavSchedulePickup}>
                              {" "}
                              Schedule Pickup{" "}
                            </a>{" "}
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/user")}>
                              Account Settings
                            </a>
                          </li>
                          {/* <li><a onClick={this.handleMobileNavInvite}>Refer your friend, get a tote</a></li> */}
                          <li>
                            <a onClick={this.handleMobileNavLogout}>Sign Out</a>
                          </li>

                          <li className="mt-5">
                            <a
                              onClick={() =>
                                this.handleNavMobile("/latest-news")
                              }
                            >
                              COVID-19
                            </a>
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/about")}>
                              About
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() =>
                                this.handleNavMobile("/howitworks")
                              }
                            >
                              How It Works
                            </a>
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/help")}>
                              Help
                            </a>
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/blog")}>
                              Blog
                            </a>
                          </li>
                          <li>
                            <a
                              onClick={() => this.handleNavMobile("/giftcard")}
                            >
                              Gift Card
                            </a>
                          </li>
                          <li>
                            <a onClick={() => this.handleNavMobile("/backers")}>
                              Our Backers
                            </a>
                          </li>
                        </React.Fragment>
                      )}

                      {!this.userStore.status && (
                        <MobileGuestNav
                          hideNav={hideNavMobile}
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
            isAdmin || isOps ? "admin-navbar" : ""
          } ${isHomePage ? "" : "util-bg-color-white"} ${
            isProductPage ? " aw-absolute" : ""
          }`}
        >
          {/* Banner that Only guests and users should see */}
          {(this.userStore.status && isUser) || !this.userStore.status ? (
            <div className={topBarClass}>
              <div className="container">
                <div onClick={this.handleBannerClick}>{bannerText}</div>
                <button
                  className="close-top-bar"
                  onClick={this.handleCloseTopBar}
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          ) : null}

          <div className="container">
            <div className="row align-items-center mobile-top-nav top-nav">
              {/* Logo */}
              <div className="d-none col-auto d-lg-block">
                <a
                  className="aw-logo d-block text-center"
                  onClick={this.handleLogo}
                >
                  <img
                    className="logo-text-desktop"
                    src="/images/TheWallyShop_Logo_Horizontal.svg"
                    alt="The Wally Shop"
                  />
                  <img
                    className="logo-text-mobile"
                    src="/images/TheWallyShop_Logo_Horizontal.svg"
                    alt="The Wally Shop"
                  />
                </a>
              </div>

              <div className="col-auto ml-auto d-none d-lg-block">
                <nav id="main-nav" className="navbar px-0 aw-nav text-center">
                  <ul className="nav m-0 p-0" role="tablist">
                    {/* Admin Menu */}
                    {this.userStore.status && isAdmin && (
                      <li>
                        <div className="col-auto ml-auto d-none d-lg-block account-dropdown">
                          <ClickOutside
                            onClickOutside={this.hideAccountDropdown}
                          >
                            <div className="btn-group">
                              <button
                                onClick={this.handleToggle}
                                className="btn btn-transparent"
                                type="button"
                                data-toggle="dropdown"
                                aria-expanded="true"
                              >
                                <span className="navbar-toggler-icon account-icon"></span>
                              </button>
                              <div
                                className={dropdownClass}
                                aria-labelledby="dropdownMenuButton"
                              >
                                <span className="dropdown-item lg">
                                  Hi {name}
                                </span>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/shopper"
                                  className="dropdown-item"
                                >
                                  Shopper
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/packaging"
                                  className="dropdown-item"
                                >
                                  Packaging
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/delivery"
                                  className="dropdown-item"
                                >
                                  Delivery
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/courier-routing"
                                  className="dropdown-item"
                                >
                                  Courier Routing
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/shopping-app-1"
                                  className="dropdown-item"
                                >
                                  Shopping App
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/orders"
                                  className="dropdown-item"
                                >
                                  Packaging App
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/products"
                                  className="dropdown-item"
                                >
                                  Products App
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/shipping"
                                  className="dropdown-item"
                                >
                                  Shipping
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/printing"
                                  className="dropdown-item"
                                >
                                  Printing
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/blog"
                                  className="dropdown-item"
                                >
                                  Blog
                                </Link>
                                <a
                                  onClick={this.handleLogout}
                                  className="dropdown-item"
                                >
                                  Sign Out
                                </a>
                              </div>
                            </div>
                          </ClickOutside>
                        </div>
                      </li>
                    )}

                    {/* Ops Menu */}
                    {this.userStore.status && (isOps || isOpsLead) && (
                      <li>
                        <div className="col-auto ml-auto d-none d-lg-block account-dropdown">
                          <ClickOutside
                            onClickOutside={this.hideAccountDropdown}
                          >
                            <div className="btn-group">
                              <button
                                onClick={this.handleToggle}
                                className="btn btn-transparent"
                                type="button"
                                data-toggle="dropdown"
                                aria-expanded="true"
                              >
                                <span className="navbar-toggler-icon account-icon"></span>
                              </button>
                              <div
                                className={dropdownClass}
                                aria-labelledby="dropdownMenuButton"
                              >
                                <span className="dropdown-item lg">
                                  Hi {name}
                                </span>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/shopping-app-1"
                                  className="dropdown-item"
                                >
                                  Shopping App
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/orders"
                                  className="dropdown-item"
                                >
                                  Packaging App
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/pick-pack-returns"
                                  className="dropdown-item"
                                >
                                  Ops Portal
                                </Link>
                                <a
                                  onClick={this.handleLogout}
                                  className="dropdown-item"
                                >
                                  Sign Out
                                </a>
                              </div>
                            </div>
                          </ClickOutside>
                        </div>
                      </li>
                    )}

                    {/* Copacking Menu */}
                    {/* TODO COMBINE WITH OPS
                    {this.userStore.status && isCopacker && (
                      <li>
                        <div className="col-auto ml-auto d-none d-lg-block account-dropdown">
                          <ClickOutside
                            onClickOutside={this.hideAccountDropdown}
                          >
                            <div className="btn-group">
                              <button
                                onClick={this.handleToggle}
                                className="btn btn-transparent"
                                type="button"
                                data-toggle="dropdown"
                                aria-expanded="true"
                              >
                                <span className="navbar-toggler-icon account-icon"></span>
                              </button>
                              <div
                                className={dropdownClass}
                                aria-labelledby="dropdownMenuButton"
                              >
                                <span className="dropdown-item lg">
                                  Hi {name}
                                </span>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/co-packing/inbound"
                                  className="dropdown-item"
                                >
                                  Inbound Shipment
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/co-packing/outbound"
                                  className="dropdown-item"
                                >
                                  Outbound Shipment
                                </Link>
                                <Link
                                  onClick={this.hideAccountDropdown}
                                  to="/manage/co-packing/runs"
                                  className="dropdown-item"
                                >
                                  Co-packing
                                </Link>
                                <a
                                  onClick={this.handleLogout}
                                  className="dropdown-item"
                                >
                                  Sign Out
                                </a>
                              </div>
                            </div>
                          </ClickOutside>
                        </div>
                      </li>
                    )} */}

                    {/* User Menu */}
                    {this.userStore.status && isUser && (
                      <React.Fragment>
                        <li className="aw-align-self-center">
                          <Link
                            className="nav-link aw-nav--link p-0 util-font-size-14"
                            to="/help"
                          >
                            Help
                          </Link>
                        </li>
                        <li>
                          <div className="col-auto ml-auto d-none d-lg-block account-dropdown">
                            <ClickOutside
                              onClickOutside={this.hideAccountDropdown}
                            >
                              <div className="btn-group">
                                <button
                                  onClick={this.handleToggle}
                                  className="text-normal btn btn-transparent util-font-size-14"
                                  type="button"
                                  data-toggle="dropdown"
                                  aria-expanded="true"
                                >
                                  <span>
                                    {" "}
                                    Hi {name}{" "}
                                    <i
                                      className="fa fa-caret-down"
                                      aria-hidden="true"
                                    >
                                      {" "}
                                    </i>
                                  </span>
                                </button>
                                <div
                                  className={dropdownClass}
                                  aria-labelledby="dropdownMenuButton"
                                >
                                  <span className="dropdown-item lg">
                                    <strong>Hi {name}</strong>
                                  </span>
                                  <a className="dropdown-item">
                                    Packaging Balance (
                                    {formatMoney(storeCredit / 100)})
                                  </a>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/orders"
                                    className="dropdown-item"
                                  >
                                    Order History
                                  </Link>
                                  <a
                                    onClick={this.handleSchedulePickup}
                                    className="dropdown-item"
                                  >
                                    {" "}
                                    Schedule Pickup
                                  </a>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/user"
                                    className="dropdown-item"
                                  >
                                    Account Settings
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/latest-news"
                                    className="dropdown-item"
                                  >
                                    COVID-19
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/about"
                                    className="dropdown-item"
                                  >
                                    About
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/howitworks"
                                    className="dropdown-item"
                                  >
                                    How It Works
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/help"
                                    className="dropdown-item"
                                  >
                                    Help
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/blog"
                                    className="dropdown-item"
                                  >
                                    Blog
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/giftcard"
                                    className="dropdown-item"
                                  >
                                    Gift Card
                                  </Link>
                                  <Link
                                    onClick={this.hideAccountDropdown}
                                    to="/backers"
                                    className="dropdown-item"
                                  >
                                    Our Backers
                                  </Link>
                                  <a
                                    onClick={this.handleRedeemDepositClick}
                                    className="dropdown-item"
                                  >
                                    Redeem Deposit
                                  </a>
                                  <a
                                    onClick={this.handleLogout}
                                    className="dropdown-item"
                                  >
                                    Sign Out
                                  </a>
                                </div>
                              </div>
                            </ClickOutside>
                          </div>
                        </li>
                      </React.Fragment>
                    )}

                    {/* Guest Menu */}
                    {!this.userStore.status && (
                      <DesktopGuestNav
                        handleLogin={this.handleLogin}
                        handleSignup={this.handleSignup}
                        handleBackers={this.handleNavBackers}
                      />
                    )}
                  </ul>
                </nav>
              </div>

              {/* Mobile Nav Toggle Button */}
              {this.userStore.status || true ? (
                <button
                  onClick={(e) => this.uiStore.toggleNavMobile()}
                  className="navbar-toggler aw-nav--toggle d-lg-none"
                  type="button"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
              ) : (
                <button
                  onClick={(e) => this.handleLogin()}
                  className="btn btn-outline-black btn-login text-caps d-md-none d-lg-none"
                >
                  Log in
                </button>
              )}
            </div>

            <div className="row d-lg-none  d-sm-block">
              <div className="col-sm-12">
                <a
                  className="aw-logo d-block text-center"
                  onClick={this.handleLogo}
                >
                  <img
                    className="logo-text-mobile util-relative util-offset-top--30"
                    src="/images/TheWallyShop_Logo_Horizontal.svg"
                    alt="The Wally Shop"
                  />
                </a>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default connect("store")(TopNav);
