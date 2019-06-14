import React, {Component} from 'react'
import ModalMissing from './shopper/ModalMissing'
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { connect } from '../../utils'
import { Form, FormGroup, Label, Input } from 'reactstrap'
import moment from 'moment'

class ShoppingAppTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      productName: null,
      shopitemId: null
    }
    this.step = this.props.step
    this.adminStore = this.props.store.admin
  }

  handleSelectAvailability = async(isAvailable, shopitemId, productName) => {
    if (isAvailable) {
      const status = 'available'
      this.adminStore.setShopItemStatus(shopitemId, status)
    } else {
      this.setState({shopitemId, productName})
      const status = 'missing'
      await this.adminStore.setShopItemStatus(shopitemId, status)
      this.toggleModal()
    }
  }

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  }

  render() {
    const {shopitems} = this.adminStore
    const {location} = this.props
    const {showModal, shopitemId, productName} = this.state
    const deliveryDate = moment().format('YYYY-MM-DD')

    return (
      <React.Fragment>
        <ModalMissing
          toggleModal={this.toggleModal}
          showModal={showModal}
          shopitemId={shopitemId}
          productName={productName}
          location={location}
          deliveryDate={deliveryDate}
        />
        <Paper elevation={1} className="scrollable-table">
          <Table className="shopping-app-table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Available</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shopitems.map((shopitem, i) => {
                const {
                  _id,
                  status,
                  product_name,
                  quantity,
                  unit_type,
                  packaging_name,
                  delivery_date
                } = shopitem
                return (
                  <TableRow
                    key={_id}
                    className={`row ${status}`}
                  >
                    <TableCell>{product_name}</TableCell>
                    <TableCell>
                      {quantity} {unit_type === "packaging" ? packaging_name : unit_type }</TableCell>
                    <TableCell>
                      <Form inline>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input type="radio" name="select" id="yesSelect" checked={status === 'available'}
                          onChange={() => this.handleSelectAvailability(true, _id)} />
                          <Label className="ml-sm-1" for="yesSelect" check>Yes</Label>
                        </FormGroup>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input type="radio" name="select" id="noSelect" checked={status === 'unavailable'}
                          onChange={() => this.handleSelectAvailability(false, _id, product_name, delivery_date)} />
                          <Label className="ml-sm-1" for="noSelect" check>No</Label>
                        </FormGroup>
                      </Form>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>
    );
  }
}

export default connect("store")(ShoppingAppTable)
