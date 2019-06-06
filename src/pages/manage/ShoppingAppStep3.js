import React, { Component } from 'react'
import { Container, Col, Row } from "reactstrap"


import CustomDropdown from '../../common/CustomDropdown'
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableFooter from '@material-ui/core/TableFooter'
import { Button } from "reactstrap"

import { connect } from '../../utils'
import { Checkbox } from '@material-ui/core';

import moment from 'moment'
import { syncHistoryWithStore } from 'mobx-react-router';

// const getShopLocations = {
//     method: "GET",
//     response: {
//         locations: ['Union Square', 'Fort Greene']
//     }
// }

// const getShopItems = {
//     method: "GET",
//     response: {
//         "shop_items": [{
//                 product_id: 'prod_123',
//                 inventory_id: 'invetory_123',
//                 organic: true,
//                 product_name: 'Awesome product',
//                 product_producer: 'Farm B',
//                 product_price: 450,
//                 missing: true,
//                 box_number: 'ABC213',
//                 substitute_for_name: null,
//                 product_substitute_reason: '',
//                 farm_substitue_reason: '',
//                 price_substitute_reason: '',
//                 product_missing_reason: '',
//                 price_unit: '1 Ct',
//                 quantity: 16,
//                 warehouse_placement: null
//             },
//             {
//                 product_id: 'prod_456',
//                 inventory_id: 'invetory_567',
//                 organic: true,
//                 product_name: 'Awesome product 2',
//                 product_producer: 'Farm A',
//                 product_price: 345,
//                 missing: false,
//                 box_number: 'XYZ213',
//                 substitute_for_name: null,
//                 product_substitute_reason: '',
//                 farm_substitue_reason: '',
//                 price_substitute_reason: '',
//                 product_missing_reason: '',
//                 price_unit: '1 Ct',
//                 quantity: 9,
//                 warehouse_placement: 'Somewhere else'
//             }
//         ]
//     }
// }

// const getTimeFrames = {
//     method: "GET",
//     response: {
//         timeframes: ['2018-10-18, 4:00-5:00PM']
//     }
// }





class ShoppingAppStep3 extends Component {
    constructor(props){
        super(props)
        this.state = {
            id: "",
            product:"",
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
        this.setState({ location })

    }

    handleOnClick = (id) => {
        // let status = "purchased"
        // this.adminStore.setShopItemStatus(status, id)
        console.log(id)
    }

    togglePopUp = () => {
        window.alert("HI")
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

    render(){
        const { locations, shopitems } = this.adminStore
        // const { location, timeframes } = this.state
        { debugger }
        return(
            <Container>
                <Row>
                    <Col 
                    md="4" sm="6"
                    align = "center">
                            <h2>Step 3</h2>
                        </Col>
                        <Col md="4" sm="6">
                            <h2>{this.state.timeframes}</h2>
                        </Col>
                    <Col 
                    md="4" sm="12"
                    align = "center"
                    >
                        <div className="mb-3">
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
                
                <Paper elevation={1}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align = "center">Product Name</TableCell>
                                <TableCell align = "center">Quantity</TableCell>
                                <TableCell align = "center">Purchased? <br/> <span align = "center"> Yes | No </span> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {shopitems.map((shopitem, i) => {
                                return(
                               <TableRow
                               key = { shopitem.product_id }
                               style= {{
                                   backgroundColor: `${this.backgroundStyle(shopitem.status)}`
                               }} 
                               >
                                <TableCell  align = "center">
                                    { shopitem.product_name}
                                </TableCell>
                                 
                                <TableCell  align = "center">
                                    { shopitem.quantity } { shopitem.unit_type === "packaging" ? shopitem.packaging_name : shopitem.unit_type }</TableCell> 

                                <TableCell>
                                <Checkbox onClick = { () => this.handleOnClick(shopitem._id) }>Yes</Checkbox>
                                <Checkbox onClick = { () => this.togglePopUp() }>No</Checkbox>
                                </TableCell>

                                </TableRow>
                                
                                )
                            })}

                    </TableBody>
                    </Table>
                </Paper>
            </Container>
        )
    }

}

export default connect("store")(ShoppingAppStep3)