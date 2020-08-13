import React from "react";
import { Link } from "react-router-dom";
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from "./MobileStyledComponents";

export function MobileOpsNav({ hideNav, handleSignout, userName, isOpsLead }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>

      {/* PICK PACK */}

      {/* <li>
        <Link to="/pick-pack-returns" onClick={hideNav}>
          <MobileNavLinkText>Ops Portal</MobileNavLinkText>
        </Link>
      </li> */}

      {/* TODO - ARE THESE STILL USED? */}

      {/* <li>
        <Link to="/manage/shopping-app-1" onClick={hideNav}>
          <MobileNavLinkText>Shopping App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/orders" onClick={hideNav}>
          <MobileNavLinkText>Packing App</MobileNavLinkText>
        </Link>
      </li> */}

      {/* <li>
        <Link to="/manage/co-packing/inbound" onClick={hideNav}>
          <MobileNavLinkText>Inbound Shipments</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/outbound" onClick={hideNav}>
          <MobileNavLinkText>Outbound Shipments</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/runs" onClick={hideNav}>
          <MobileNavLinkText>Co-packing</MobileNavLinkText>
        </Link>
      </li> */}
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
  // <React.Fragment>
  //   <li>
  //     <a style={{ fontSize: "15px" }}>
  //       <strong>Hello {name}</strong>
  //     </a>
  //   </li>
  //   <li>
  //     <a onClick={() => this.handleNavMobile("/manage/shopping-app-1")}>
  //       Shopping App
  //     </a>
  //   </li>
  //   <li>
  //     <a onClick={() => this.handleNavMobile("/manage/orders")}>Packing App</a>
  //   </li>
  //   <li>
  //     <a onClick={() => this.handleNavMobile("/pick-pack-returns")}>
  //       Ops Portal
  //     </a>
  //   </li>
  //   <li>
  //     <a onClick={this.handleMobileNavLogout}>Sign Out</a>
  //   </li>
  // </React.Fragment>;
  {
    /* TODO COMBINE WITH OPS */
  }
  {
    /* {this.userStore.status && isCopacker && (
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
                      )} */
  }
}

export function DesktopOpsNav() {}
