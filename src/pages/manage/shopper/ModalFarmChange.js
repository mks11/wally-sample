import React, { Component } from 'react'
import CustomDropdown from '../../../common/CustomDropdown'
import { connect } from '../../../utils'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'

const DEFAULT_TITLE = 'Out of stock today'
const dropdown = [
  { id: DEFAULT_TITLE, title: DEFAULT_TITLE },
  { id: 'Out of stock for the season', title: 'Out of stock for the season' },
  { id: 'Price too high', title: 'Price too high' }
]

class ModalFarmChange extends Component {
  constructor(props) {
    super(props)

    this.state = {
      reason: DEFAULT_TITLE
    }

    this.modalStore = this.props.store.modal
  }

  toggle = () => {
    this.modalStore.toggleChangeFarm()
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
    const { changeFarm } = this.modalStore

    return (
      <Modal isOpen={changeFarm} toggle={this.toggle} className="modal-shopper">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={this.toggle}></button>
        </div>
        <ModalBody>
          <div className="signup-wrap">
            <p>Are you sure? Please select reason for this?</p>
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

export default connect("store")(ModalFarmChange)
