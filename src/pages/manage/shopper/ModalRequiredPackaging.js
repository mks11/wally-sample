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


class ModalRequiredPackaging extends Component {

  componentDidMount = () => {
  }

  render() {
    const { showModal, toggleModal } = this.props

    return (
      <Modal isOpen={showModal} toggle={toggleModal} className="modal-required-packaging">
        <ModalBody>
          Hello
        </ModalBody>
      </Modal>
    )
  }
}

export default connect("store")(ModalRequiredPackaging)
