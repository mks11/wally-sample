import React, { Component } from 'react'
import { connect } from '../../../utils'
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap'


// const DEFAULT_TITLE = 'Cheapest option'
// const dropdown = [
//   { id: DEFAULT_TITLE, title: DEFAULT_TITLE },
//   { id: 'No similar products', title: 'No similar products' }
// ]

class ModalPriceChange extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }

    this.modalStore = this.props.store.modal
  }

  toggle = () => {
    // this.modalStore.toggleChangePrice()
    console.log('hi');
  }

  // loadPackagingInfo = async() => {
  //   await 
  // }

  render() {


    return (
      // <Modal isOpen={changePrice} toggle={this.toggle} className="modal-shopper">
      <Modal>
    
        {/* <div className="modal-header modal-header--sm">
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
        </ModalFooter> */}
      </Modal>
    )
  }
}

export default connect("store")(ModalPriceChange)
