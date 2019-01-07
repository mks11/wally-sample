import React, {Component} from 'react'
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {connect} from '../../utils'

class ShopperTable extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.adminStore = this.props.store.admin
  }

  onEditClick = (e) => {
    const productId = e.target.getAttribute('prod-id')
    this.adminStore.setEditing(productId, true)
  }

  onSubmitClick = (productId, updateditem) => {
    const {timeframe} = this.props
    const {complete, ...rest} = updateditem

    this.adminStore.setEditing(productId, false)
    this.adminStore.updateShopItem(timeframe, productId, rest)
  }

  render() {
    let {
      shopitems,
      shopitemsFarms,
    } = this.adminStore
    const {timeframe} = this.props

    const totalPrice = ({shopitems}) => shopitems && shopitems.reduce((sum, item) => sum + item.product_price, 0)
    const renderStatus = (shopitem) => {
      if (shopitem.completed) {
        return 'Completed'
      } else if (shopitem.missing) {
        return 'Missing'
      } else {
        return 'Incomplete'
      }
    }
    // todo remove this
    shopitems = [
      {
        _id: 1,
        product_id: 'prod_123',
        inventory_id: 'invetory_123',
        organic: true,
        product_name: 'Awesome product',
        location: 'test location',
        product_producer: 'Farm B',
        product_price: 450,
        missing: true,
        box_number: 'ABC213',
        substitute_for_name: null,
        product_substitute_reason: '',
        farm_substitue_reason: '',
        price_substitute_reason: '',
        product_missing_reason: '',
        price_unit: '1 Ct',
        quantity: 16,
        warehouse_placement: null
      },
      {
        _id: 2,
        product_id: 'prod_456',
        inventory_id: 'invetory_567',
        location: 'test location 2',
        organic: true,
        product_name: 'Awesome product 2',
        product_producer: 'Farm A',
        product_price: 345,
        missing: false,
        box_number: 'XYZ213',
        substitute_for_name: null,
        product_substitute_reason: '',
        farm_substitue_reason: '',
        price_substitute_reason: '',
        product_missing_reason: '',
        price_unit: '1 Ct',
        quantity: 9,
        warehouse_placement: 'Somewhere else'
      }
    ]

    return (
      <Paper elevation={8}>
        <Table className={"shopper-table"}>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align={"right"}>Quantity</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopitems.map(shopitem => {
              return (
                <TableRow
                  key={shopitem.product_id}
                  className={`row ${shopitem.completed ? 'completed' : ''} ${shopitem.missing ? 'missing' : ''}`}
                  onClick={() => this.props.toggleSingleProductView(shopitem)}
                >
                  <TableCell component="th" scope="row" padding={"dense"}>
                    {shopitem.location}
                  </TableCell>
                  <TableCell>{shopitem.product_name}</TableCell>
                  <TableCell align="right">{shopitem.quantity}</TableCell>
                  <TableCell>{renderStatus(shopitem)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align={"center"} colSpan={12}>
                <b>Total Price:</b> ${totalPrice({shopitems}) / 100}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
    /*return (
      <Table responsive className="shopper-table">
        <TableHead/>
        <tbody>
        {shopitems &&
        shopitems.map(item => {
          return (item.complete === undefined || item.complete) ? (
              <TableRow
                key={item._id}
                item={item}
                onEditClick={this.onEditClick}
                onClick={() => this.props.toggleSingleProductModal(item)}
              />
          ) : (
              <TableEditRow
                key={item._id}
                item={item}
                shopitemsFarms={shopitemsFarms}
                onSubmitClick={this.onSubmitClick}
                timeframe={timeframe}
              />
          )
        })}
        </tbody>
        <TableFoot {...{shopitems}} />
      </Table>
    )*/
  }
}

export default connect("store")(ShopperTable)
