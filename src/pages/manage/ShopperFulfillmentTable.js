import React, { Component } from 'react'
import { Container, Col } from "reactstrap"


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





class ShopperFulfillmentTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            id: "",
            product:"",
            finalQuantity:"", 
            timeframe: null
        }
        this.adminStore = this.props.store.admin
    }

 

    



    render(){
        
        return(
            <Container>    

               <Col md="6" sm="12">
                    <div className="mb-3">
                      <div className="mb-2 font-weight-bold">Location:</div>
                <CustomDropdown 
                    values={[{id: 'all', title: 'All Location'}]}
                    onClick = {this.getTimeFrames}
                    
                    />
                    </div>
                  </Col>



                <Paper elevation={1}>
                
                    
                    <Table>
                        
                        

                        <TableHead>
                         
                                <TableRow>
                                    <TableCell align = "center">Product Name</TableCell>
                                    <TableCell align = "center">Quantity</TableCell>
                                    <TableCell align = "center">Purchased?</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell  align = "center">Carrots</TableCell>
                                    <TableCell  align = "center">2 bunches</TableCell>
                                    <TableCell>
                                        <label>Yes</label>    
                                    <Checkbox>Yes</Checkbox>

                                    
                                    <Checkbox size = "small">No</Checkbox>
                                    <label>No</label>
                                    </TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        )
    }

}

export default connect("store")(ShopperFulfillmentTable)