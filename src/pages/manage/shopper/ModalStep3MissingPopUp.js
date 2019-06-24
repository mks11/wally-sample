import React, { Component } from 'react'
import { connect } from '../../../utils'

import {
Modal,
ModalBody,
Button,
Container,
Row,
Col
} from 'reactstrap'
import Table from '@material-ui/core/Table'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'

import TableRow from '@material-ui/core/TableRow'
import { Checkbox } from '@material-ui/core';
import Input from '@material-ui/core/Input'

class ModalStep3MissingPopUp extends Component {
    constructor(props){
        super(props)
        this.state = {
            id: null,
            status: null,
            quantity: null,
            selected: null,
            shopitem: null,
            timeframe: null
        }
        this.adminStore = this.props.store.admin
    }


    componentDidMount(){
        const {id, status, timeframe} = this.props
        this.setState({
            id: id,
            status: status,
            timeframe: timeframe
        })
    }


    handleOnChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
        console.log(this.state)
    }

    handleChecked = () => {
        const { selected } = this.state

        if ( selected === "missing" ){
            return true
        } else {
            return false
        }
    }

    handleSubmit = async() =>{
        //debugger
        const {toggleModal, id} = this.props
        const {selected, quantity, timeframe} = this.state
        let status = ""

        if (selected === "ugly" || selected === "too little") {
            status = "issue"
        } else {
            status = "missing"
        }


        // uncomment when ready for testing against API
        // await this.adminStore.setShopItemStatus(status, id)
        // await this.adminStore.updateShopItemQuantity(timeframe, id, quantity)

        console.log(id, status, quantity)
        toggleModal()
    }

    render(){
        const { showModal, toggleModal } = this.props 

        
        let renderQuantity
        let renderQuantityInput

        if( this.props.shopitem ){
            renderQuantity =    <TableCell 
                                 align = "center">
                                    {this.props.shopitem.quantity } { this.props.shopitem.unit_type === "packaging" ? this.props.shopitem.packaging_name : this.props.shopitem.unit_type }
                                </TableCell>
        } else {
            renderQuantity = null
        }

        if ( this.handleChecked() ){
           renderQuantityInput = <Input
                disabled
                onChange = {this.handleOnChange}
                value = {this.state.quantity}
                id = "quantity"
                style = {{
                    width: "60px"
                }}/>
        } else {
           renderQuantityInput = <Input
                onChange = {this.handleOnChange}
                value = {this.state.quantity}
                id = "quantity"
                style = {{
                    width: "60px"
                }}/>
        }
        
        return(
            <Modal isOpen = { showModal } toggle = { toggleModal }>
                <ModalBody>
                    <Container>
                            <Button close onClick = {toggleModal}/>
                            <h3>  {this.props.shopitem ? this.props.shopitem.product_name : null} Unavailable</h3>
                            <Table >

                                <TableBody>

                                    <h5>Missing Reason (please select one):</h5>
                                    <TableRow>
                                        <TableCell> Missing :</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox   id = "selected" value = "missing" onClick={ this.handleOnChange }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > Ugly:</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox value = "ugly" id = "selected" onClick = { this.handleOnChange }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > Too little:</TableCell>
                                        <TableCell align = "center">
                                            <Checkbox value = "too little" id = "selected" onClick = { this.handleOnChange }/>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow >
                                        <TableCell > 
                                        <strong>Quantity Available:</strong><br/>
                                        (if ugly or too little. how many available?)
                                        </TableCell>
                                        <TableCell >
                                        
                                       {renderQuantityInput}
                                        
                                       </TableCell>
                                       {renderQuantity} 
                                    </TableRow>
                                </TableBody>
                                        
                            </Table>
                         
                         <Row>
                         <Col  style = {{paddingTop: "20px"}} sm="12" md={{ size: 6, offset: 4 }}>
                         <Button 
                            value = {this.props.shopitem ? this.props.shopitem._id : null}
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