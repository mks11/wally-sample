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

class CourierRouting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      loading: false
    };
  }

  componentDidMount = () => {
    fetch(
      "https://raw.githubusercontent.com/tamlim/the-wally-shop-frontend/packing-combined/db.json?token=AGFWDKPT6TOVFG4CPVR7X6K5DYLE4"
    )
      .then(res => res.json())
      .then(json => this.setState({ routes: json, loading: true }))
      .catch(error => console.log(error));
  };
  render() {
    const { routes, loading } = this.state;
    console.log(routes);
    return !loading ? (
      <h1>Loading...</h1>
    ) : (
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
                {routes.map((route, i) => {
                  return (
                    <TableRow key={i}>
                      <TableCell>{route.route_number}</TableCell>
                      <TableCell>False</TableCell>
                      <TableCell>{route.text}</TableCell>
                      <TableCell>
                        <InputGroup>
                          <Input />
                        </InputGroup>
                      </TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          color="primary"
                          size={"medium"}
                          type={"button"}
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
      </section>
    );
  }
}

export default CourierRouting;
