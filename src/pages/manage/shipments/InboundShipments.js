import React, { Component } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  ModalBody,
  Button,
  UncontrolledCollapse
} from "reactstrap";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { connect } from "utils";
import Title from "./../../../common/page/Title";
import {
  Modal,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import moment from "moment";

class InboundShipments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      openModal: false,
      apiError: false,
      collapse: true,
      selectedRow: null
    };
    this.userStore = this.props.store.user;
    this.adminStore = props.store.admin;
  }

  componentDidMount() {
    this.userStore.getStatus(true).then(status => {
      const user = this.userStore.user;
      if (!user) {
        this.props.store.routing.push("/");
      } else {
        let isAdmin = user.type === "admin" ? true : false;
        if (!status || !isAdmin) {
          this.props.store.routing.push("/");
        } else {
          this.adminStore
            .getInboundProductShipments()
            .then(res => {
              console.log(res);
              if (res) {
                // Uncomment below to test long lists
                // let extra = [...res.data, ...res.data, ...res.data];
                // this.setState({
                //   results: extra
                // });

                // Comment below out to test the above
                this.setState({
                  results: res.data
                });
              } else {
                this.setState({
                  apiError: true,
                  openModal: true
                });
              }
            })
            .catch(err => {
              this.setState({
                apiError: true,
                openModal: true
              });
            });
        }
      }
    });
  }

  setRowChoice = i => {
    this.setState({
      selectedRow: i,
      collapse: !this.state.collapse
    });
  };

  handleModalClose = () => {
    this.setState({
      openModal: false,
      apiError: false
    });
  };

  render() {
    let results = this.state.results;
    // let errors = this.state.errors;
    let buttonClass = "btn btn-main my-3";

    return (
      <>
        <section className="page-section pt-1 fulfillment-page">
          <Title content="Inbound Shipments" />
          <Container>
            <Modal open={this.state.apiError} onClose={this.handleModalClose}>
              <Paper
                style={{
                  height: "auto",
                  minHeight: "200px",
                  width: "80%",
                  margin: "auto",
                  marginTop: "20%",
                  textAlign: "center"
                }}
                elevation={2}
              >
                <h3>API Error</h3>
              </Paper>
            </Modal>
            <Paper style={{ minHeight: "500px" }} elevation={1}>
              <Table
                style={{
                  borderTop: "1px solid rgb(153, 152, 155, 0.44)"
                }}
              >
                <TableBody>
                  {results.map((shipment, i) => (
                    <TableRow
                      key={shipment.origin.partner_name + i}
                      style={{
                        border: "1px solid rgb(153, 152, 155, 0.44)",
                        borderTop: "none",
                        height: "auto",
                        minHeight: "50px",
                        cursor: "pointer",
                        padding: 10
                      }}
                    >
                      <TableCell style={{ padding: "5px 10px" }}>
                        <span
                          id={"toggler" + i}
                          onClick={() => this.setRowChoice(i)}
                        >
                          <div
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div style={{ width: "98%" }}>
                              {shipment.shipment_type.toUpperCase()}

                              {" - "}
                              {shipment.origin.partner_name}
                              {" - "}

                              {moment(shipment.edd.substring(0, 10)).format(
                                "YYYY-MM-DD"
                              )}
                            </div>
                            <div>
                              {this.state.selectedRow === i &&
                              !this.state.collapse ? (
                                <ArrowDropUpIcon />
                              ) : (
                                <ArrowDropDownIcon />
                              )}
                            </div>
                          </div>
                        </span>
                        <UncontrolledCollapse toggler={"#toggler" + i}>
                          <h3 style={{ margin: "15px 0" }}>Packing List:</h3>
                          <Table>
                            <TableHead
                              style={{
                                backgroundColor: "rgb(153, 152, 155, 0.44)"
                              }}
                            >
                              <TableRow>
                                <TableCell
                                  style={{ padding: "1em" }}
                                  align="left"
                                >
                                  Name
                                </TableCell>
                                <TableCell
                                  style={{ padding: "1em" }}
                                  align="right"
                                >
                                  Volume (lbs)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody
                              style={{ minHeight: "200px", maxWidth: "100%" }}
                            >
                              {shipment.packing_list.map(product => (
                                <TableRow key={product.name + i}>
                                  <TableCell
                                    style={{ padding: "1em" }}
                                    align="left"
                                  >
                                    {product.name}
                                  </TableCell>
                                  <TableCell
                                    style={{ padding: "1em" }}
                                    align="right"
                                  >
                                    {product.volume}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </UncontrolledCollapse>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Container>
        </section>
      </>
    );
  }
}
export default connect("store")(InboundShipments);
