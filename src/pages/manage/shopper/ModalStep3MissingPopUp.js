import React, { Component } from 'react'
import { connect } from '../../../utils'

import {
Modal,
ModalBody,
ModalFooter,
Button,
Container,
Row,
Col
} from 'reactstrap'
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Checkbox } from '@material-ui/core';
import Input from '@material-ui/core/Input'

class ModalStep3MissingPopUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            id: "",
            status: "",
            quantity: "",
            selected: []
        }
        this.adminStore = this.props.store.admin
    }

   

    //functions i might need to update item
    // setShopItemStatus(status, shopitem_id)
    //updateShopItemQuantity(timeframe, shopitem_id, data)

    handleOnClick = (e) => {
        let checkedStatus = e.target.value
        let status = ""
        
        if ( checkedStatus === "ugly" || checkedStatus === "too little"){
            status = "issue"
        } else {
            status = "missing"

        }

        this.setState({
            status: status
        })
        console.log(status)
        console.log(this.state.status)
    }

    handleOnChange = () => {

    }

    handleSubmit = () =>{

    }

    render(){
        
        const { showModal, toggleModal } = this.props 


        return(
            <Modal isOpen = { false } toggle = { toggleModal }>
                <ModalBody>
                    <Container>
                        
                            <h3>  {this.props.shopitem.product_name} Unavailable</h3>
                            <Table >

                                <TableBody>
                                    <h5>Missing Reason:</h5>
                                    <TableRow>
                                        <TableCell> Missing :</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox value = "missing" onClick={ (e) => this.handleOnClick(e) }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > Ugly:</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox value = "ugly" onClick = { (e) => this.handleOnClick(e) }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > Too little:</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox value = "too little" onClick = { (e) => this.handleOnClick(e) }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > 
                                        <strong>Quantity Available:</strong>
                                        </TableCell>
                                        <TableCell >
                                        <Input 
                                        style = {{
                                            width: "60px"
                                        }}/>
                                        </TableCell>
                                        <TableCell align = "center">
                                            { this.props.shopitem.quantity } { this.props.shopitem.unit_type === "packaging" ? this.props.shopitem.packaging_name : this.props.shopitem.unit_type }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                        
                            </Table>
                         
                         <Row>
                         <Col  style = {{paddingTop: "20px"}} sm="12" md={{ size: 6, offset: 4 }}>
                         <Button 
                            className = "btn-sm"
                            onClick = {(e) => this.handleSubmit(e)}> Submit </Button>
                        </Col>
                        </Row>
                    </Container>
                    
                </ModalBody>
            </Modal>
        )
    }

}

export default connect("store")(ModalStep3MissingPopUp)