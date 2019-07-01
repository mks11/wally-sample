import React, { Component } from "react";
import { connect } from "../../utils";
import {
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import { Col, Row, ControlLabel, FormControl, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button/Button";
import CloseIcon from "@material-ui/icons/Close";
import ArrowLeft from "@material-ui/icons/KeyboardArrowLeftOutlined";
import ArrowRight from "@material-ui/icons/KeyboardArrowRightOutlined";
import Typography from "@material-ui/core/Typography/Typography";
import Select from "react-select";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Route from "./Route";
import CourierModal from "./CourierModal";
const customColumnStyle = { width: 100, padding: 0 };
class CourierRouting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      isCourierModalOpen: false,
      courierPhoneNumber: "",
      route_assigned: false
    };
  }

  componentDidMount = () => {
    fetch("http://localhost:4001/api/test/get-routes")
      .then(res => res.json())
      .then(json => this.setState({ routes: json }))
      .catch(error => console.log(error));
  };

  setPhoneNumber = e => {
    const { courierPhoneNumber } = this.state;
    debugger;
    courierPhoneNumber[e.target.name] = e.target.value;
    this.setState({
      courierPhoneNumber: e.target.value
    });
  };

  assignCourierModal = e => {
    let routeNumber = e.route_number;
    let routeAssigned = e.route_assigned;
    fetch(`http://localhost:4001/api/test/assign-routes/${routeNumber}`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res === true) {
          this.setState({
            isCourierModalOpen: true
          });
        } else {
          this.setState({
            courierPhoneNumber: this.state.courierPhoneNumber,
            route_assigned: routeAssigned
          });
        }
      });
  };

  // toggleModalOff = e => {
  //   this.setState({
  //     isCourierModalOpen: false
  //   });
  // };

  // createNewCourier = e => {
  //   const { isCourierModalOpen } = this.state;
  //   console.log("hit");
  //   return fetch("http://localhost:4001/api/test/get-couriers", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({})
  //   });
  //   this.setState({
  //     isCourierModalOpen: false
  //   });
  // };
  render() {
    const { routes, courierPhoneNumber, route_assigned } = this.state;

    return (
      <section className="courier-page">
        <Container>
          <Paper elevation={1} className={"scrollable-table"}>
            <Table className={"packaging-table"} padding={"dense"}>
              <TableHead>
                <TableRow>
                  <TableCell>Route Number</TableCell>
                  <TableCell>Route Assigned</TableCell>
                  <TableCell>Route text</TableCell>
                  <TableCell>Courier Telephone</TableCell>
                  <TableCell />
                </TableRow>
                {routes.map((route, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{route.route_number}</TableCell>
                      <TableCell>{route.assigned.toString()}</TableCell>
                      <TableCell>{route.text}</TableCell>
                      <TableCell>
                        <InputGroup>
                          {courierPhoneNumber.length !== null ? (
                            <Input
                              value={courierPhoneNumber}
                              name="courierPhoneNumber"
                              onChange={this.setPhoneNumber}
                              style={customColumnStyle}
                            />
                          ) : (
                            <Input
                              placeholder="Enter your number here"
                              value={courierPhoneNumber}
                              onChange={this.setPhoneNumber}
                              onKeyPress={this.handlePhoneNumberKeyPress}
                              type="number"
                              name="courierPhoneNumber"
                              style={customColumnStyle}
                            />
                          )}
                        </InputGroup>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size={"medium"}
                          type={"button"}
                          onClick={() =>
                            this.assignCourierModal({
                              route_number: route.route_number,
                              route_assigned: true
                            })
                          }
                        >
                          Assign
                          <CourierModal
                            isOpen={this.state.isCourierModalOpen}
                            courierPhoneNumber={this.state.courierPhoneNumber}
                            createNewCourier={this.createNewCourier}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableHead>
              <TableBody />
            </Table>
          </Paper>
        </Container>
      </section>
    );
  }
}

export default CourierRouting;
