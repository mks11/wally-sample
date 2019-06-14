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

  componentDidMount = () => {
    this.loadShopperPackagingInfo()
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.location !== this.props.location) {
      this.loadShopperPackagingInfo()
    }
  }

  loadShopperPackagingInfo = () => {
    const {timeframe, location} = this.props
    this.adminStore.getShopperPackagingInfo(timeframe, location)
  }

  render() {
    const {packagingCounts} = this.adminStore
    const {packaging, togglePackaging} = this.modalStore
    const packagingNames = Object.keys(packagingCounts)
    return (
      <Modal isOpen={packaging} className="modal-required-packaging">
      <button className="btn-icon btn-icon--close" onClick={togglePackaging}></button>
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
      </Modal>
    )
  }
}

export default connect("store")(ModalRequiredPackaging)
