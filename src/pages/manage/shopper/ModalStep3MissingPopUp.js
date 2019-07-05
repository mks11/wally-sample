import React, { Component } from 'react'
import { connect } from '../../../utils'

import {
Modal,
ModalBody,
Button,
Container,
Row,
Col,
Form,
FormGroup,
Input
} from 'reactstrap'

import Table from '@material-ui/core/Table'

import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'

import TableRow from '@material-ui/core/TableRow'



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
            timeframe: timeframe,
            selected: "missing"
        })
    }


    handleOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
            status = selected
        } else {
            status = "missing"
        }


        // uncomment when ready for testing against API
        await this.adminStore.setShopItemStatus(id, status, quantity)
        // await this.adminStore.updateShopItemQuantity(timeframe, id, quantity)


        toggleModal()
    }

    render(){
        const { showModal, toggleModal } = this.props 

        let renderQuantity
        let renderQuantityInput

        // handles when prop is empty
        if( this.props.shopitem ){
            renderQuantity =    <TableCell 
                                 align = "center">
                                    {this.props.shopitem.quantity } { this.props.shopitem.unit_type === "packaging" ? this.props.shopitem.packaging_name : this.props.shopitem.unit_type }
                                </TableCell>
        } else {
            renderQuantity = null
        }

        //handles input enabled or disabled
        if ( this.handleChecked() ){
           renderQuantityInput = <Input
                type = "text"
                onChange = {this.handleOnChange}
                value = {this.state.quantity}
                name = "quantity"
                style = {{
                    width: "60px"
                }}
                disabled
                bsSize = "sm"
                />
        } else {
           renderQuantityInput = <Input
                onChange = {this.handleOnChange}
                value = {this.state.quantity}
                name = "quantity"
                style = {{
                    width: "60px"
                }}
                bsSize = "sm"
                />
        }
        
        return(
            <Modal isOpen = { showModal } toggle = { toggleModal }>
                <ModalBody>
                    <Container>
                            <Button close onClick = {toggleModal}/>
                            <h3>  {this.props.shopitem ? this.props.shopitem.product_name : null} Unavailable</h3>
                            <Form >
                                <FormGroup className="mr-sm-2" check inline>
                                    <Table >
                                        <TableBody>
                                            <h5>Missing Reason (please select one):</h5>
                                            <TableRow>
                                                <TableCell> Missing:</TableCell>

                                                <TableCell align = "center">
                                                    
                                                    <Input type="radio" name="selected" id="missingSelect" value = 'missing'
                                                    onClick={ this.handleOnChange } defaultChecked/>
                                                        
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow >
                                                <TableCell> Ugly:</TableCell>
                                                <TableCell align = "center">
                                                    
                                                    <Input type="radio" name="selected" id="uglySelect" value = 'ugly'
                                                    onClick={  this.handleOnChange } />
                                                        
                                                </TableCell>
                                            </TableRow>
                                            
                                            <TableRow>
                                                <TableCell> Too little:</TableCell>
                                                <TableCell align = "center">
                                                
                                                    <Input type="radio" name="selected" id="tooLittleSelect" value = 'too little'
                                                    onClick={  this.handleOnChange } />
                                                        
                                                </TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell> 
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
                                </FormGroup>
                            </Form>
                         
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