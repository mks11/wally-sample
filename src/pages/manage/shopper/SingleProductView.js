import React, { Component } from 'react';
import {Modal, ModalBody, ModalHeader, ModalFooter, Button, } from 'reactstrap';
import { connect } from '../../../utils'
import {Col, ControlLabel, FormControl, FormGroup, Form} from "react-bootstrap"

class SingleProductView extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.userStore = this.props.store.user
  }

  componentDidMount() {

  }

  handleSubmit(e) {

  }

  render() {
    const {product, isOpen} = this.props
    return (
        <Modal
          className="xl-modal"
          isOpen={isOpen}
          toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>{product.product_name}</ModalHeader>
          <ModalBody>
            <Form horizontal={true}>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                  Product:
                </Col>
                <Col sm={10}>
                  <FormControl type="email" placeholder="Email" />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Previous</Button>
            <Button color="primary">Submit</Button>
            <Button color="primary">Next</Button>
          </ModalFooter>
        </Modal>
    );
  }
}

export default connect("store")(SingleProductView);
