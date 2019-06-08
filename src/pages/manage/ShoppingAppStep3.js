import React, { Component } from 'react'
import { Container, Col, Row, Button } from "reactstrap"
import { Link } from 'react-router-dom'

import CustomDropdown from '../../common/CustomDropdown'
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import { Checkbox } from '@material-ui/core';

import ModalStep3MissingPopUp from './shopper/ModalStep3MissingPopUp'

import { connect } from '../../utils'


import moment from 'moment'
import { syncHistoryWithStore } from 'mobx-react-router';


class ShoppingAppStep3 extends Component {
    constructor(props){
        super(props)
        this.state = {
            showModal: false,
            id: null,
            product: null,
            quantity:"",
            shopitems: null,
            timeframes: `${moment().format("YYYY-MM-DD")} 2:00 - 8:00 PM`,
            locations: [],
            shop_location: null,
            location: null,
            "purchased": null
        }
        this.adminStore = this.props.store.admin
    }

 
    grabShopLocations = () => {
        let { timeframes } = this.state
        this.adminStore.getShopLocations(timeframes)
    }
   
    grabShopItems = (location) => {
        const { timeframes } = this.state
        this.adminStore.getShopItems(timeframes, location)
        // this.setState({ location })

    }

    handleOnSelectClick = async(status, id, product) => {
        if(status){
        // let status = "purchased"
        // this.adminStore.setShopItemStatus(status, id)
        } else {
            let status = "missing"
            console.log(status, id, product)
            this.toggleModal()
        }
        
    }

    toggleModal = () => {
        // this.setState(prevState => ({
        //     showModal: !prevState.showModal
        // }));
    }

    backgroundStyle = (status) => {
        if (status === "pending") {
            return "#ffb74d" //light orange
        } else if (status === "available"){
            return "#eeeeee" //light grey
        } else if (status === "purchased"){
            return "#76ff03" // light green
        } else {
            return "#e53935" // light red
        }
    } 

    componentDidMount(){
        this.grabShopLocations()
    }

     item  = {
                    "missing": false,
                    "completed": false,
                    "_id": "5bdf3cf9838c6f239f7c038b",
                    "product_id": "prod_157",
                    "product_name": "Eggplant",
                    "product_price": 200,
                    "total": 200,
                    "inventory_id": "5b91d6fc6165340c1496d05a",
                    "product_producer": "Migliorelli Farm LLC",
                    "product_shop": "Stuyvesant Town Green Market",
                    "price_unit": "lb",
                    "quantity": 1,
                    "final_quantity": 1,
                    "organic": false,
                    "product_id_ref": "5b91d06e1507c10be69b68e1"
                }

    render(){
        const { locations, shopitems } = this.adminStore
        const { showModal, id, product } = this.state


        { debugger }
        return(
            <React.Fragment>
            <ModalStep3MissingPopUp
                toggleModal = { this.toggleModal() }
                showModal = { showModal }
                id = { id }
                shopitem = { this.item }/>
                


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
                                <TableCell align = "center">Purchased? <br/> <span align = "center"> Yes | No </span> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Need to sort via status. Pending */}
                            {shopitems.map((shopitem, i) => {
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

                                        <TableCell>
                                            <Checkbox onClick = { () => this.handleOnClick(shopitem._id) }>Yes</Checkbox>
                                            <Checkbox onClick = { () => this.togglePopUp(shopitem) }>No</Checkbox>
                                        </TableCell>

                                    </TableRow>
                                
                                )
                            })}

                    </TableBody>
                    <Col style = {{padding: "10px"}} sm={{size:6, offset: 4}} md={{ size: 6, offset: 4 }}>
                            <Link to="#">
                                <Button className = "btn-sm"> Reload </Button>
                            </Link>
                            </Col>
                    </Table>
                           

                </Paper>
            
             {/* CCS location on Main CSS line 1155 */}
                        <Container className = "step3-btn-spacing">
                        <Row>
                            <Col lg="4" xs="6" sm={{ size: 'auto', offset: 2 }}>
                            {/* need to add link to step two route  */}
                            <Link to="#"> 
                                <Button className = "btn-sm"> Step 2 </Button>
                            </Link>
                            </Col>
                            
                            <Col lg="4" xs="6" sm={{ size: 'auto', offset: 2 }}>
                            {/* need to add link to capture view */}
                            <Link to="#">
                                <Button className = "btn-sm"> Capture </Button>
                            </Link>
                            </Col>
                        </Row>
                    </Container>
            
            <React.Fragment>
             <Button style={{paddingTop: "40x"}} onClick = { () => {  this.handleOnSelectClick(false, this.item._id, this.item) }}>step 3 popup</Button>
            </React.Fragment>   


            </Container>

             </React.Fragment>
        )
    }

}

export default connect("store")(ShoppingAppStep3)