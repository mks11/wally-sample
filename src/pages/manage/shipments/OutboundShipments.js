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
  ModalBody
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
  Button,
  Modal,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel
} from "@material-ui/core";

class OutboundShipments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      modal: null,
      openModal: false,
      carrier: null,
      trackingEdit: "",
      errors: null,
      apiError: false
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
            .getOutboundProductShipments()
            .then(res => {
              if (res) {
                this.setState({
                  results: res.data
                });
                console.log(res.data);
              } else {
                this.setState({
                  apiError: true
                });
              }
            })
            .catch(err => {
              this.setState({
                apiError: true
              });
            });
        }
      }
    });
  }

  setOutboundModal = res => {
    let carrierFix;
    if (res.carrier) {
      carrierFix = res.carrier;
    } else {
      carrierFix = "ups";
    }
    this.setState({
      modal: res,
      openModal: true,
      carrier: carrierFix,
      trackingEdit: res.tracking_number
    });
  };
  handleModalClose = () => {
    this.setState({
      modal: null,
      openModal: false,
      apiError: false
    });
  };

  handlePrintEmail = url => {
    // currently sends undefined since the backend gives no packinglist_url
    this.adminStore.getPrintEmail(url).then(res => {
      console.log(res);
    });
  };

  render() {
    let results = this.state.results;
    let chosenShipment = this.state.modal;
    let carrier = this.state.carrier;
    let trackingNum = this.state.trackingEdit;
    let errors = this.state.errors;
    let buttonClass = "btn btn-main my-3";
    return (
      <>
        <section className="page-section pt-1 fulfillment-page">
          <Title content="Outbound Shipments" />
          <Container
            style={{
              width: "97%",
              margin: "auto",
              paddingRight: 4,
              paddingLeft: 4
            }}
          >
            <Paper
              style={{ minHeight: "600px" }}
              elevation={1}
              className={"scrollable-table"}
            >
              <table style={{ width: "98%", margin: "auto" }}>
                <tr style={{ whiteSpace: "nowrap" }}>
                  <td style={{ padding: "5px 3px" }}>Shipment ID</td>
                  <td style={{ padding: "5px 3px" }}>Address</td>
                  <td style={{ padding: "5px 3px" }}>Carrier</td>
                  <td style={{ padding: "5px 3px" }}>Tracking #</td>
                </tr>
                <tbody>
                  {results.length > 0 &&
                    results.map((res, i) => {
                      return (
                        <tr
                          style={{ cursor: "pointer", padding: "5px 3px" }}
                          onClick={() => this.setOutboundModal(res)}
                        >
                          <td style={{ padding: "5px 3px" }}>{res._id}</td>
                          <td style={{ padding: "5px 3px" }}>
                            {res.destination.address.name}{" "}
                            {res.destination.address.street1}{" "}
                            {res.destination.address.street2}{" "}
                            {res.destination.address.city},{" "}
                            {res.destination.address.state}{" "}
                            {res.destination.address.zip}
                          </td>
                          <td style={{ padding: "5px 3px" }}>
                            {" "}
                            {res.carrier ? res.carrier : ""}
                          </td>
                          <td style={{ padding: "5px 3px" }}>
                            {res.tracking_number ? res.tracking_number : ""}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Paper>
          </Container>
        </section>
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
        <Modal open={this.state.openModal} onClose={this.handleModalClose}>
          <Container>
            <button
              className="btn-icon btn-icon--close"
              onClick={() => this.handleModalClose()}
            ></button>
            <Paper style={{ height: "auto", marginTop: "30px" }} elevation={2}>
              {chosenShipment !== null && (
                <Title content={"Shipment " + chosenShipment._id} />
              )}

              <Table className={"packaging-table"}>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <label style={{ marginRight: 15 }}>Carrier: </label>

                      <span>
                        {chosenShipment ? (carrier ? carrier : "ups") : "ups"}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <label style={{ marginRight: 15 }}>Tracking #: </label>

                      <span>
                        {chosenShipment ? (trackingNum ? trackingNum : "") : ""}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" style={{ marginTop: "140px" }}>
                      <div
                        style={{
                          display: "flex",
                          width: "30%",
                          margin: "auto",
                          justifyContent: "center"
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          style={{
                            fontSize: "14px",
                            minWidth: "190px"
                          }}
                          onClick={() =>
                            this.handlePrintEmail(chosenShipment.label_url)
                          }
                        >
                          Print Shipping Label
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell align="center">
                      <div
                        style={{
                          display: "flex",
                          width: "20%",
                          margin: "auto",
                          justifyContent: "center",
                          minWidth: "180px"
                        }}
                      >
                        {chosenShipment !== null && (
                          <a href={chosenShipment.packing_list_url}>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              style={{
                                fontSize: "14px",
                                minWidth: "180px"
                              }}
                              onClick={() =>
                                this.handlePrintEmail(
                                  chosenShipment.packing_list_url
                                )
                              }
                            >
                              Print Packing List
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <ModalBody
                className="modal-body-bordertop"
                style={{ paddingTop: "4%" }}
              >
                <Container
                  style={{
                    width: "96%",
                    margin: "auto"
                  }}
                >
                  <h3>Packing List:</h3>
                  <Table>
                    <TableHead style={{ marginTop: "10px" }}>
                      <TableRow
                        className="col-form-label-lg"
                        style={{
                          backgroundColor: "rgb(191, 191, 191)",
                          padding: "2%",
                          height: "2rem"
                        }}
                      >
                        <TableCell align="left">
                          <div style={{ fontSize: "15px" }}>Name</div>
                        </TableCell>
                        <TableCell align="left">
                          <div style={{ fontSize: "15px" }}>Quantity</div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ minHeight: "100px" }}>
                      {chosenShipment !== null &&
                        chosenShipment.packing_list.map((product, i) => (
                          <TableRow key={i}>
                            {console.log(product)}
                            <TableCell align="left">{product.name}</TableCell>
                            <TableCell align="left">
                              {product.units} Jars / {product.cases} Case
                              {product.cases === 1 ? null : "s"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Container>
              </ModalBody>
            </Paper>
          </Container>
        </Modal>
      </>
    );
  }
}
export default connect("store")(OutboundShipments);
