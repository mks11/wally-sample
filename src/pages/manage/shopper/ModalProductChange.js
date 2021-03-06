import React, { Component } from 'react'
import CustomDropdown from '../../../common/CustomDropdown'
import { connect } from '../../../utils'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'

const DEFAULT_TITLE = 'Price increase was too high'

const dropdown = [
  { id: DEFAULT_TITLE, title: DEFAULT_TITLE },
  { id: 'Was not available at any farm', title: 'Was not available at any farm' },
  { id: 'Produce quality was bad', title: 'Produce quality was bad' },
]

class ModalProductChange extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reason: DEFAULT_TITLE
    }

    this.modalStore = this.props.store.modal
  }

  toggle = () => {
    this.modalStore.toggleChangeProduct()
  }

  onModalSubmit = () => {
    const { onSubmit } = this.props
    const { reason } = this.state

    onSubmit && onSubmit(reason)
    this.toggle()
  }

  onDropdownChange = (reason) => {
    this.setState({ reason }) 
  }

  render() {
    const { changeProduct } = this.modalStore

    return (
      <Modal isOpen={changeProduct} toggle={this.toggle} className="modal-shopper">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.toggle}></button>
        </div>
        <ModalBody>
          <div className="signup-wrap">
            <p>Have you checked all the farms?</p>
            <p>Please select reason for this?</p>
            <CustomDropdown
              values={dropdown}
              onItemClick={this.onDropdownChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="login-wrap mb-5">
            <Button color="primary" onClick={this.onModalSubmit} className="btn-text">Submit</Button>
          </div>
        </ModalFooter>
      </Modal>
    )
  }
}

export default connect("store")(ModalProductChange)
