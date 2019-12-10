import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Container, Row, Col, ModalBody, Button } from "reactstrap";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import { connect } from "utils";
import Title from "./../../../common/page/Title";
import { Modal, TextField, FormControl, MenuItem, Select, InputLabel } from "@material-ui/core";

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
              console.log(res);
              if (res) {
                this.setState({
                  results: res.data
                });
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

  handleCarrierSelection = e => {
    this.setState({
      carrier: e.target.value
    });
  };
  handleBlankCarrier = carr => {
    this.setState({
      carrier: carr
    });
  };

  handleTrackingEdit = e => {
    if (this.state.errors && this.state.trackingEdit >= 2) {
      this.setState({
        errors: null
      });
    }
    this.setState({
      trackingEdit: e.target.value
    });
  };

  handleSubmit = () => {
    if ((this.state.trackingEdit && this.state.trackingEdit.length > 2) || this.state.carrier === "other") {
      let newItem;
      // Update Locally - since no api return yet
      let updatedResults = this.state.results.map(item => {
        if (this.state.modal._id === item._id) {
          newItem = item;
          newItem.tracking_number = this.state.trackingEdit;
          newItem.carrier = this.state.carrier;
          return newItem;
        }
        return item;
      });
      this.adminStore.updateProductShipment(newItem._id, { tracking_number: this.state.trackingEdit, carrer: this.state.carrier });
      this.setState({
        results: updatedResults,
        openModal: false,
        modal: null
      });
      // ::: Uncomment Below for api call and api error checking :::
      //      this.adminStore
      //   .updateProductShipment()
      //   .then(res => {
      //     if (res) {
      //       this.setState({
      //         results: res.data,
      //         openModal: false,
      //         modal: null
      //       });
      //     }
      //   })
      //   .catch(err => {
      //     this.setState({
      //       apiError: true
      //     });
      //   });
    } else {
      this.setState({
        errors: "Please Enter Valid Tracking #"
      });
    }
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
          <Container>
            <Paper style={{ minHeight: "600px" }} elevation={1} className={"scrollable-table"}>
              <Table className={"packaging-table"}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Shipment ID</TableCell>
                    <TableCell align="left">Adress</TableCell>
                    <TableCell align="right">Carrier</TableCell>
                    <TableCell align="right">Tracking #</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ minHeight: "500px" }}>
                  {results.length > 0 &&
                    results.map((res, i) => {
                      return (
                        <TableRow key={res.tracking_number + i} onClick={() => this.setOutboundModal(res)}>
                          <TableCell align="left">{res._id}</TableCell>
                          <TableCell align="left">{res.destination.address.name} {res.destination.address.street1} {res.destination.address.street2} {res.destination.address.city}, {res.destination.address.state} {res.destination.address.zip}</TableCell>
                          <TableCell align="right">{res.carrier ? res.carrier : ""}</TableCell>
                          <TableCell align="right">{res.tracking_number ? res.tracking_number : ""}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
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
            <button className="btn-icon btn-icon--close" onClick={() => this.handleModalClose()}></button>
            <Paper style={{ height: "auto", marginTop: "30px" }} elevation={2}>
              {chosenShipment !== null && <Title content={"Shipment " + chosenShipment._id} />}

              <Table className={"packaging-table"}>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">
                      <FormControl variant="filled">
                        <InputLabel>Carrier</InputLabel>

                        <Select
                          style={{ minWidth: "180px" }}
                          // Value checks for a chosenShipment, otherwise "ups default"
                          // If carrier happens to be null it also defaults to ups
                          value={chosenShipment ? (carrier ? carrier : "ups") : "ups"}
                          onChange={e => this.handleCarrierSelection(e)}
                        >
                          <MenuItem name={"ups"} value={"ups"}>
                            ups
                          </MenuItem>
                          <MenuItem name={"usps"} value={"usps"}>
                            usps
                          </MenuItem>
                          <MenuItem name={"fedex"} value={"fedex"}>
                            fedex
                          </MenuItem>

                          <MenuItem value={"other"}>
                            <em>other</em>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center">
                      <TextField
                        error={!!errors}
                        id="standard-basic"
                        label="Tracking #"
                        helperText={errors ? errors : ""}
                        value={chosenShipment ? (trackingNum ? trackingNum : "") : ""}
                        onChange={e => this.handleTrackingEdit(e)}
                      />
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
                          color="primary"
                          size="sm"
                          style={{ fontSize: "16px" }}
                          onClick={() => this.handleSubmit()}
                        >
                          Submit
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
                            <Button outline color="success" size="sm" style={{ fontSize: "16px", minWidth: "180px" }}>
                              Print Packing List
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <ModalBody className="modal-body-bordertop" style={{ paddingTop: "4%" }}>
                <Container
                  style={{
                    width: "93%",
                    margin: "auto"
                  }}
                >
                  <h3>Packing List:</h3>
                  <Table>
                    <TableHead style={{ marginTop: "10px" }}>
                      <TableRow
                        className="col-form-label-lg"
                        style={{ backgroundColor: "rgb(191, 191, 191)", padding: "2%", height: "2rem" }}
                      >
                        <TableCell align="left">
                          <h6 style={{ margin: "auto" }}>Name</h6>
                        </TableCell>
                        <TableCell align="left">
                          <h6 style={{ margin: "auto" }}>Quantity</h6>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{ minHeight: "100px" }}>
                      {chosenShipment !== null &&
                        chosenShipment.packing_list.map((product, i) => (
                          <TableRow key={i}>
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
