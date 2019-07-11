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
import moment from "moment";

const customColumnStyle = { width: 100, padding: 0 };

class CourierRouting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      isCourierModalOpen: -1
    };
    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
  }

  componentDidMount = () => {
    this.userStore
      .getStatus(true)
      .then(status => {
        const user = this.userStore.user;
        if (!status || user.type !== "admin") {
          this.props.store.routing.push("/");
        } else {
          const time = moment().format("YYYY-MM-DD");
          fetch(
            `${BASE_URL}/api/admin/routes/?timeframe=2019-07-08 2:00-8:00pm`
          )
            .then(res => res.json())
            .then(json => this.setState({ routes: json }))
            .catch(error => console.log(error));
        }
      })
      .catch(error => {
        this.props.store.routing.push("/");
      });
  };

  setPhoneNumber = (e, i) => {
    const value = e.target.value;
    const routes = this.state.routes;
    routes[i] = {
      ...routes[i],
      courier_telephone: value
    };

    this.setState({
      routes
    });
  };

  assignCourierModal = (route, i) => {
    let routeId = route._id;
    let courierPhoneNumber = route.courier_telephone;
    return fetch(`${BASE_URL}/api/admin/route/${routeId}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        courier_telephone: courierPhoneNumber
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.new_user === true) {
          this.setState({
            isCourierModalOpen: i
          });
        } else {
          const newRoutes = this.state.routes;
          newRoutes[i].assigned = true;
          newRoutes[i].courier_telephone = route.courier_telephone;
          this.setState({
            routes: newRoutes
          });
          alert("Success");
        }
      });
  };

  toggleModalOff = e => {
    this.setState({
      isCourierModalOpen: -1
    });
  };

  render() {
    const { routes } = this.state;
    return (
      <section className="courier-page">
        <Container>
          <Paper elevation={1} className={"scrollable-table"}>
            <Table className={"courier-table"} padding={"dense"}>
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
                      <TableCell>{route.courier_text}</TableCell>
                      <TableCell>
                        {route.courier_telephone !== null ? (
                          route.courier_telephone
                        ) : (
                          <InputGroup>
                            <Input
                              placeholder="Enter your number here"
                              value={route.courier_telephone}
                              onChange={e => this.setPhoneNumber(e, i)}
                              type="number"
                              name="courier_telephone"
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
                            !route.courier_telephone ||
                            route.courier_telephone.length !== 10 ||
                            route.courier_telephone
                              .split("")
                              .some(elem => !elem.match(/[0-9]/))
                              ? alert("please enter a valid phone number")
                              : this.assignCourierModal(route, i);
                          }}
                        >
                          Assign
                          <CourierModal
                            isOpen={this.state.isCourierModalOpen === i}
                            onClose={this.toggleModalOff}
                            courierPhoneNumber={route.courier_telephone}
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

export default connect("store")(CourierRouting);
