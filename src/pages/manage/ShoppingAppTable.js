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
      this.adminStore.setShopItemStatus(status, shopitemId)
    } else {
      this.setState({shopitemId, productName})
      const status = 'missing'
      // await this.adminStore.setShopItemStatus(status, shopitemId)
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
    const renderStatus = (shopitem) => {
      if (this.step === '1') {
        if (shopitem.completed) {
          return 'completed'
        } else if (shopitem.missing) {
          return 'missing'
        } else {
          return 'incomplete'
        }
      } else {
        if (shopitem.user_checked) {
          return 'checked'
        } else if (shopitem.user_checked === false) {
          return 'not-checked'
        }
      }
    }

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
                return (
                  <TableRow
                    key={shopitem._id}
                    className={`row ${renderStatus(shopitem)}`}
                  >
                    <TableCell>{shopitem.product_name}</TableCell>
                    <TableCell>
                      {shopitem.quantity} {shopitem.unit_type === "packaging" ? shopitem.packaging_name : shopitem.unit_type }</TableCell>
                    <TableCell>
                      <Form inline>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input type="radio" name="select" id="yesSelect"
                          onChange={() => this.handleSelectAvailability(true, shopitem._id)} />
                          <Label className="ml-sm-1" for="yesSelect" check>Yes</Label>
                        </FormGroup>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input type="radio" name="select" id="noSelect"
                          onChange={() => this.handleSelectAvailability(false, shopitem._id, shopitem.product_name, shopitem.delivery_date)} />
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
