import React, { Component } from 'react'
import { Container, Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap"
import { Link } from 'react-router-dom'

import CustomDropdown from "../../common/CustomDropdown";
import Table from "@material-ui/core/Table";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Checkbox } from "@material-ui/core";

import ModalStep3MissingPopUp from "./shopper/ModalStep3MissingPopUp";
import Title from "../../common/page/Title";
import ManageTabs from "../manage/ManageTabs";

import { connect } from "../../utils";

import moment from "moment";
import { syncHistoryWithStore } from "mobx-react-router";

const axios = require("axios");

class ShoppingAppStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      id: null,
      product: null,
      status: null,
      timeframes: `${moment().format("YYYY-MM-DD")} 2:00-8:00PM`,
      location: null
    };
    this.adminStore = this.props.store.admin;
    this.userStore = this.props.store.user;
  }

  grabShopLocations = () => {
    let { timeframes } = this.state;

    this.adminStore.getShopLocations(timeframes);
  };

  grabShopItems = location => {
    const { timeframes } = this.state;
    this.adminStore.getShopItems(timeframes, location);
    this.setState({ location });
  };


  handleOnSelectClick = async (status, id, product) => {
    const { location } = this.state
    if(status){
      let status = "purchased"

      this.adminStore.setShopItemStatus(this.userStore.getHeaderAuth(), id, status, location)
      } else {
      let status = "missing"
      this.setState({
          id: id,
          product: product,
          status: status
      })

      this.toggleModal()
    }
  };

  handleReload = e => {
    e.preventDefault();
    const { timeframes, location } = this.state;
    this.adminStore.getShopItems(timeframes, location);
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };

  backgroundStyle = status => {
    if (status === "pending") {
      return "#ffb74d"; //light orange
    } else if (status === "available") {
      return "#eeeeee"; //light grey
    } else if (status === "purchased") {
      return "#76ff03"; // light green
    } else {
      return "#e53935"; // light red
    }
  };

  componentDidMount(){
      this.userStore.getStatus(true)
      .then((status) => {
          const user = this.userStore.user
          
          if( status && (user.type === 'admin' || user.type === 'super-admin' || user.type === 'tws-ops')){
              this.grabShopLocations()
          } else {
              this.props.store.routing.push('/')
          }
      })
      .catch((error) => {
          this.props.store.routing.push('/')
      })
  }

  statusSort = (item) => {

      let statusLib = ["pending", "available", "purchased", "issue", "unavailable"]
      let indexMap = {}

      for (let i = 0; i < statusLib.length; i++) {
          indexMap[statusLib[i]] = i
      }

      return item.slice().sort((a, b) => {
          return indexMap[a.status] - indexMap[b.status]
      })
  }

  render() {
    const { locations, shopitems } = this.adminStore
    const { showModal, id, product, status, timeframes, location } = this.state


    return(
        <React.Fragment>
        <ModalStep3MissingPopUp
            toggleModal = { this.toggleModal }
            showModal = { showModal }
            id = { id }
            status = { status }
            shopitem = { product }
            timeframes = { timeframes }
            location = { location }
            />
            
        <ManageTabs page="shopper" />
        <Title content="Shopping App" />

        <Container>
            <Row>
                <Col 
                md="4" sm="12"
                align = "center">
                        <h2>Step 3</h2>
                </Col>
                    <Col 
                    md="4" sm="12">
                        <h2>{ this.state.timeframes }</h2>
                    </Col>
                <Col 
                md="4" sm="12"
                align = "center">
                    <div 
                    className="mb-3">
                        <CustomDropdown
                            values={[
                            { id: "all", title: "All Locations" },
                            ...locations.map(item => {
                                return { id: item, title: item };
                            })
                            ]}
                            onItemClick={ this.grabShopItems }
                        />
                    </div>
                </Col>
            </Row>
            
            <Paper elevation = { 1 } className={"scrollable-table"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align = "center">Product Name</TableCell>
                            <TableCell align = "center">Quantity</TableCell>
                            <TableCell > Purchased? </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* sorted by status */}
                        {this.statusSort(shopitems).map((shopitem, i) => {
                            return(
                                <TableRow
                                key = { shopitem.product_id }
                                style= {{
                                    backgroundColor: `${this.backgroundStyle(shopitem.status)}`
                                }}>
                                    
                                    <TableCell  align = "center">
                                        { shopitem.product_name}
                                    </TableCell>
                                    
                                    <TableCell  align = "center">
                                        { shopitem.quantity } { shopitem.unit_type === "packaging" ? shopitem.packaging_name : shopitem.unit_type }</TableCell> 

                                    <TableCell align = "center">
                                    
                                    <Form inline>
                                        <FormGroup className="mr-sm-2" check inline>
                                            <Input type="radio" name="select" id="yesSelect" checked={status === 'available'}
                                            onChange={() => this.handleOnSelectClick(true, shopitem._id, shopitem)} />
                                            
                                            <Label className="ml-sm-1" for="yesSelect" check>Yes</Label>
                                        </FormGroup>	                        
                                            
                                        <FormGroup className="mr-sm-2" check inline>
                                            <Input type="radio" name="select" id="noSelect" checked={status === 'unavailable'}
                                            onChange={() => this.handleOnSelectClick(false, shopitem._id, shopitem)} />
                                            
                                            <Label className="ml-sm-1" for="noSelect" check>No</Label>
                                        </FormGroup>
                                    </Form>
                                    </TableCell>

                                </TableRow>
                            
                            )
                        })}

                    </TableBody>
                <Col style = {{padding: "10px"}} sm={{size:6, offset: 4}} md={{ size: 6, offset: 4 }}>
                        <Link to="#">
                            <Button className = "btn-sm" onClick = {this.handleReload}> Reload </Button>
                        </Link>
                        </Col>
                </Table>
                       
            </Paper>
        
                    {/* CCS location on Main CSS line 1155 */}
                    <Container style = {{padding: "10px"}} className = "step3-btn-spacing">
                    <Row>
                        <Col lg="4" xs="6" sm={{ size: 'auto', offset: 2 }}>

                        <Link to="/manage/shopping-app-2"> 
                            <Button className = "btn-sm"> Step 2 </Button>
                        </Link>
                        </Col>
                        
                        <Col lg="4" xs="6" sm={{ size: 'auto', offset: 2 }}>
                        {/* need to add link to capture view */}
                        <Link to="/manage/receipts">
                            <Button className = "btn-sm"> Capture </Button>
                        </Link>
                        </Col>
                    </Row>
                </Container>
            </Container>

        </React.Fragment>
    )
  }
}

export default connect("store")(ShoppingAppStep3);
