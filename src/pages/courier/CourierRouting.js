import React, { Component } from "react";
import moment from "moment";
import {
  Container,
  Input,
  InputGroup,
} from "reactstrap";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import CourierModal from "./CourierModal";
import { connect } from "../../utils";

const customColumnStyle = { width: 100, padding: 0 };

class CourierRouting extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
    this.modalStore = props.store.modal;

    this.state = {
      routes: [],
      isCourierModalOpen: false,
      selectedModalPhoneNumber: null,
      busy: false,
    };
  }

  componentDidMount = () => {
    this.userStore.getStatus(true)
      .then(status => {
        const user = this.userStore.user;

        if (!status || user.type !== "admin") {
          this.props.store.routing.push("/");
        } else {
          const options = this.userStore.getHeaderAuth()
          const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`

          this.adminStore.getRoutes(timeframe, options)
            .then(res => this.setState({ routes: res }))
        }
      })
      .catch(() => {
        this.props.store.routing.push("/");
      });
  };

  setPhoneNumber = (e, i) => {
    const { routes } = this.state;
    const value = e.target.value;
    
    routes[i] = {
      ...routes[i],
      courier_telephone: value
    };

    this.setState({ routes });
  };

  assignCourierModal = (route, i) => {
    const { routes, busy } = this.state

    if (busy) return
    this.setState({ busy: true })

    const { _id, courier_telephone } = route;
    const options = this.userStore.getHeaderAuth()

    this.adminStore.assignCourier(_id, { courier_telephone }, options)
      .then(res => {
        if (res.new_user === true) {
          this.setState({
            isCourierModalOpen: true,
            selectedModalPhoneNumber: routes[i].courier_telephone
          });
        } else {
          routes[i].assigned = true;
          routes[i].courier_telephone = route.courier_telephone;
          this.setState({ routes });
        }
      })
      .catch(() => {
        this.modalStore.toggleModal('error')
      })
      .finally(() => {
        this.setState({ busy: false })
      })
  };

  handleAssignClick = (route, i) => {
    if (!route.courier_telephone
      || route.courier_telephone.length !== 10
      || route.courier_telephone.split('').some(d => !d.match(/[0-9]/))) {
        this.modalStore.toggleModal('error', 'Please enter a valid phone number')
        return
      }
    this.assignCourierModal(route, i);
  }

  toggleModalOff = () => {
    this.setState({
      isCourierModalOpen: false,
      selectedModalPhoneNumber: null,
    });
  };

  render() {
    const {
      busy,
      routes,
      isCourierModalOpen,
      selectedModalPhoneNumber,
    } = this.state;

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
                      </TableCell>
                      <TableCell>
                        <Button
                          disabled={busy}
                          variant="contained"
                          color="primary"
                          size={"medium"}
                          type={"button"}
                          onClick={() => this.handleAssignClick(route, i)}
                        >
                          Assign
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
        <CourierModal
          isOpen={isCourierModalOpen}
          onClose={this.toggleModalOff}
          courierPhoneNumber={selectedModalPhoneNumber}
        />
      </section>
    );
  }
}

export default connect("store")(CourierRouting);
