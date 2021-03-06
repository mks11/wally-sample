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
    this.userStore = this.props.store.user
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

  onSelect = (id, selectedStatus) => {
    this.setState({ [id]: selectedStatus })
  }

  onUpdateClick = (shopitem_id, e) => {
    e.stopPropagation()
    e.preventDefault()
    const status = this.state[shopitem_id];
    this.adminStore.setShopItemStatus(shopitem_id, status);
  }

  sortByStatus = (a, b) => {
    const sortOrder = ['pending', 'available', 'unavailable', 'purchased']
    return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status)
  }

  render() {
    const {shopitems} = this.props
    const totalPrice = ({shopitems}) => shopitems && shopitems.reduce((sum, item) => sum + item.estimated_total, 0)
    
    return (
      <Paper elevation={1} className={"scrollable-table"}>
        <Table className={"shopper-table"}>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align={"right"}>Quantity</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopitems.sort(this.sortByStatus).map((shopitem, i) => {
              return (
                <TableRow
                  key={shopitem._id}
                  className={`row ${shopitem.completed ? 'purchased' : 'available'} `}
                  onClick={() => this.props.toggleSingleProductView(shopitem, i)}
                >
                  <TableCell component="th" scope="row" padding={"dense"}>
                    {shopitem.product_producer} - {shopitem.product_shop}
                  </TableCell>
                  <TableCell>{shopitem.product_name}</TableCell>
                  <TableCell align="right">
                    {shopitem.quantity} {shopitem.unit_type === "packaging" ? shopitem.packaging_name : (shopitem.unit_type || shopitem.price_unit) }</TableCell>
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
  }
}

export default connect("store")(ShopperTable)
