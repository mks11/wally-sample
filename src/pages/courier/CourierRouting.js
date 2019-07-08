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
import CourierModal from "./CourierModal";
import { BASE_URL } from "../../config";
const customColumnStyle = { width: 100, padding: 0 };

class CourierRouting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      isCourierModalOpen: -1
    };
  }

  componentDidMount = () => {
    fetch(`${BASE_URL}/api/test/get-routes`)
      .then(res => res.json())
      .then(json => this.setState({ routes: json, loading: true }))
      .catch(error => console.log(error));
  };

  setPhoneNumber = (e, i) => {
    const value = e.target.value;
    const routes = this.state.routes;

    routes[i] = {
      ...routes[i],
      courierPhoneNumber: value
    };

    this.setState({
      routes
    });
  };

  assignCourierModal = (route, i) => {
    let routeNumber = route.route_number;
    let courierNumber = route.courierPhoneNumber;

    fetch(`${BASE_URL}/api/test/assign-routes/${routeNumber}/${courierNumber}`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        if (res) {
          this.setState({
            isCourierModalOpen: i
          });
        } else {
          const newRoutes = this.state.routes;
          newRoutes[i].assigned = true;
          newRoutes[i].courierPhoneNumber = route.courierPhoneNumber;
          this.setState({
            routes: newRoutes
          });
        }
      });
  };

  toggleModalOff = e => {
    this.setState({
      isCourierModalOpen: -1
    });
  };
  test = () => {
    console.log("hi");
  };

  render() {
    const { routes, currentPhoneNumber } = this.state;
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
                        {route.courier_telephone !== null ? (
                          route.courier_telephone
                        ) : (
                          <InputGroup>
                            <Input
                              placeholder="Enter your number here"
                              value={route.courierPhoneNumber || ""}
                              onChange={e => this.setPhoneNumber(e, i)}
                              type="number"
                              name="courierPhoneNumber"
                              style={customColumnStyle}
                            />
                          </InputGroup>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size={"medium"}
                          type={"button"}
                          onClick={() => {
                            route.courierPhoneNumber === undefined &&
                            route.courier_telephone === null
                              ? alert("please enter phone number")
                              : this.assignCourierModal(route, i);
                          }}
                        >
                          Assign
                          <CourierModal
                            isOpen={this.state.isCourierModalOpen === i}
                            onClose={this.toggleModalOff}
                            courierPhoneNumber={route.courierPhoneNumber}
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
