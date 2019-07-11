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
      productName: null,
      shopitemId: null,
    }

    this.step = this.props.step
    this.timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`
    this.adminStore = props.store.admin
    this.modalStore = props.store.modal
    this.userStore = props.store.user
  }

  handleSelectAvailability = async(isAvailable, shopitemId, productName) => {
    const {location} = this.props
    if (isAvailable) {
      const status = 'available'
      this.adminStore.setShopItemStatus(this.userStore.getHeaderAuth(), shopitemId, status, location)
    } else {
      this.setState({shopitemId, productName})
      const status = 'missing'
      this.adminStore.setShopItemStatus(this.userStore.getHeaderAuth(), shopitemId, status, location)
      await this.adminStore.getSubInfo(shopitemId, this.timeframe, location)
      this.modalStore.toggleMissing()
    }
  }

  render() {
    const {shopitems} = this.adminStore
    const {shopitemId, productName} = this.state
    return (
      <React.Fragment>
        <ModalMissing
          shopitemId={shopitemId}
          location={this.props.location}
          productName={productName}
          timeframe={this.timeframe}
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
                  delivery_date,
                  user_checked
                } = shopitem
                const checked = this.step == '1' ? 'checked' : (user_checked ? 'checked' : 'not-checked')
                const rowClass = this.step == '1' ? status : (this.step == '2' ? (user_checked ? 'checked' : 'not-checked') : status)
                return (
                  <TableRow
                    key={_id}
                    className={`row ${rowClass}`}
                  >
                    <TableCell>{product_name}</TableCell>
                    <TableCell>
                      {quantity} {unit_type === "packaging" ? packaging_name : unit_type }</TableCell>
                    <TableCell>
                      <Form inline>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input
                            type="radio"
                            name="select"
                            id="yesSelect"
                            checked={this.step == '1' ? status === 'available' : (this.step == '2' ? (user_checked && status === 'available') : false)}
                            onChange={() => this.handleSelectAvailability(true, _id)}
                          />
                          <Label className="ml-sm-1" for="yesSelect" check>Yes</Label>
                        </FormGroup>
                        <FormGroup className="mr-sm-2" check inline>
                          <Input
                            type="radio"
                            name="select"
                            id="noSelect"
                            checked={this.step == '1' ? status === 'unavailable' : (this.step == '2' ? (user_checked && status === 'unavailable') : false)}
                            onChange={() => this.handleSelectAvailability(false, _id, product_name, delivery_date)}
                          />
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
