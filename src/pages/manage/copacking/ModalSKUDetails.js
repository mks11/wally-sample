import React, { Component } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'

import { connect } from 'utils'

class ModalSKUDetails extends Component {
  constructor(props) {
    super(props)

    this.adminStore = props.store.admin
    this.userStore = props.store.user
    this.modalStore = props.store.modal

    this.state = {
      id: null,
      status: null,
      quantity: null,
      selected: null,
      shopitem: null,
      timeframe: null,
      busy: false,
    }
  }


  componentDidMount() {
    // const { id, status, timeframe } = this.props
    // this.setState({
    //   id: id,
    //   status: status,
    //   timeframe: timeframe,
    //   selected: "missing"
    // })
  }


  // handleOnChange = (e) => {
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  //   console.log(this.state)
  // }

  // handleChecked = () => {
  //   const { selected } = this.state

  //   if (selected === "missing") {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  // handleSubmit = async () => {
  //   //debugger
  //   const { toggleModal, id, location } = this.props
  //   const { selected, quantity, timeframe, busy } = this.state
  //   let status = ""

  //   if (busy) return
  //   this.setState({ busy: true })

  //   if (selected === "ugly" || selected === "too little") {
  //     status = selected
  //   } else {
  //     status = "missing"
  //   }

  //   // uncomment when ready for testing against API
  //   Promise.all([
  //     this.adminStore.setShopItemStatus(this.userStore.getHeaderAuth(), id, status, location, quantity),
  //     // this.adminStore.updateShopItemQuantity(timeframe, id, quantity)
  //   ]).then(() => {
  //       toggleModal()
  //     })
  //     .catch(() => {
  //       this.modalStore.toggleModal('error')
  //     })
  //     .finally(() => {
  //       this.setState({ busy: false })
  //     })
  // }

  render() {
    const { showModal, toggleModal } = this.props

    let renderQuantity
    let renderQuantityInput

    // handles when prop is empty
    // if (this.props.shopitem) {
    //   renderQuantity = <TableCell
    //     align="center">
    //     {this.props.shopitem.quantity} {this.props.shopitem.unit_type === "packaging" ? this.props.shopitem.packaging_name : this.props.shopitem.unit_type}
    //   </TableCell>
    // } else {
    //   renderQuantity = null
    // }

    //handles input enabled or disabled
    // if (this.handleChecked()) {
    //   renderQuantityInput = <Input
    //     type="text"
    //     onChange={this.handleOnChange}
    //     value={this.state.quantity}
    //     name="quantity"
    //     style={{
    //       width: "60px"
    //     }}
    //     disabled
    //     bsSize="sm"
    //   />
    // } else {
    //   renderQuantityInput = <Input
    //     onChange={this.handleOnChange}
    //     value={this.state.quantity}
    //     name="quantity"
    //     style={{
    //       width: "60px"
    //     }}
    //     bsSize="sm"
    //   />
    // }

    return (
      <Modal
        isOpen={showModal}
        toggle={toggleModal}
      >
        <ModalBody>
          <Container>
            <Button close onClick={toggleModal} />
            <h3>{this.props.shopitem ? this.props.shopitem.product_name : null} Unavailable</h3>
            <Form >
              <FormGroup>
                <Table >
                  <TableBody>
                    <TableRow>
                      <TableCell align="left"><b>Product Name:</b></TableCell>
                      <TableCell align="left">Green Lentils</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left"><b>Unit Weight:</b></TableCell>
                      <TableCell align="left">
                        <Input type="text" name="selected" onClick={this.handleOnChange} />
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left"><b>Estimated Quantity:</b></TableCell>
                      <TableCell align="left">50</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>
                        <Row>
                          <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                            <button type="button" className="btn btn-main active">Print Product Labels</button>
                          </Col>
                        </Row>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Row>
                          <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                            <button type="button" className="btn btn-main active">Scan QR Code</button>
                          </Col>
                        </Row>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left"><b>Actual Quantity:</b></TableCell>
                      <TableCell align="left">TBD</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2}>
                        <Row>
                          <Col className="p-2 text-center" sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                            <button type="button" className="btn btn-main active">Print UPC Code</button>
                          </Col>
                        </Row>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left" colSpan={2}><b>Outbound Shipments:</b></TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell align="left">&nbsp;&nbsp;Shipment A:</TableCell>
                      <TableCell align="left">TBD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">&nbsp;&nbsp;Shipment B:</TableCell>
                      <TableCell align="left">TBD</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">&nbsp;&nbsp;Shipment C:</TableCell>
                      <TableCell align="left">TBD</TableCell>
                    </TableRow>

                  </TableBody>
                </Table>
              </FormGroup>
            </Form>
          </Container>
        </ModalBody>
      </Modal>
    )
  }

}

export default connect("store")(ModalSKUDetails)
