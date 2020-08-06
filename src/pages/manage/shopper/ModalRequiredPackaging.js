import React, { Component } from 'react'
import { connect } from '../../../utils'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Modal, ModalBody, Container } from 'reactstrap'

class ModalRequiredPackaging extends Component {
  constructor(props) {
    super(props)

    this.adminStore = props.store.admin
    this.modalStore = props.store.modal
  }

  render() {
    const {packagingCounts} = this.adminStore
    const {packaging, togglePackaging} = this.modalStore
    const packagingNames = Object.keys(packagingCounts)

    let content = null

    if (packagingNames.length) {
      content = (
        <ModalBody>
          <Container>
            <Table>
              <TableBody>
                {packagingNames.map(packagingName => (
                  <TableRow key={packagingName}>
                    <TableCell>{packagingName}</TableCell>
                    <TableCell>{packagingCounts[packagingName]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Container>
        </ModalBody>
      )
    } else {
      content = (
        <ModalBody className="modal-body-no-footer">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2 text-error">Oh no!</h3>
            <span className="mb-5">Sorry. We couldn't retrieve or there is no package information now. Please try again later.</span>
          </div>
        </ModalBody>
      )
    }
    
    return (
      <Modal isOpen={packaging} className="modal-required-packaging">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={togglePackaging}></button>
        </div>
        {content}
      </Modal>
    )
  }
}

export default connect("store")(ModalRequiredPackaging)
