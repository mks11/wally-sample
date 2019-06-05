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
  Container
} from 'reactstrap'


class ModalRequiredPackaging extends Component {

  componentDidMount = () => {
    // this.loadShopperPackagingInfo()
  }

  loadShopperPackagingInfo = () => {
    const { timeframe, shop_location } = this.props
    this.adminStore.getShopperPackagingInfo(timeframe, shop_location)
  }

  render() {
    const { showModal, toggleModal } = this.props
    // const { packagingCounts } = this.adminStore
    const packagingCounts = {
      "Muslin Bag - Large": 2,
      "Mesh Bag": 3,
    }
    const packagingNames = Object.keys(packagingCounts)

    return (
      <Modal isOpen={showModal} toggle={toggleModal} className="modal-required-packaging">
        <ModalBody>
          <Container>
            <Table>
              <TableBody>
                {packagingNames.map(packagingName => (
                  <TableRow>
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
