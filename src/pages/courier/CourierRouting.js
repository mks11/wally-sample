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
const data = [
  {
    delivery_date: "2018-06-20",
    order_ids: "50CN3H",
    route_number: 1,
    route_placement: "test",
    status: "complete"
  },
  {
    delivery_date: "2018-06-21",
    order_ids: "0GPVL1",
    route_number: 2,
    route_placement: "test",
    status: "complete"
  },
  {
    delivery_date: "2018-06-21",
    order_ids: "50CN3G",
    route_number: 3,
    route_placement: "test",
    status: "incomplete"
  },
  {
    delivery_date: "2018-06-21",
    order_ids: "TUXI3",
    route_number: 4,
    route_placement: "test",
    status: "incomplete"
  }
];
class CourierRouting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: []
    };
  }

  fetchRoutes = () => {
    let API_TEST_URL = "http://localhost:4001";
  };
  render() {
    const { routes } = this.state;
    console.log(routes);
    return (
      <section className="courier-page">
        <Container>
          <div className="mb-4">
            <Button
              variant="contained"
              color="default"
              onClick={this.props.toggle}
            >
              <CloseIcon />
              <Typography>Close</Typography>
            </Button>
          </div>
          <hr />
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
              </TableHead>
              <TableBody />
            </Table>
          </Paper>
        </Container>
        <h1>Test</h1>
      </section>
    );
  }
}

export default CourierRouting;
