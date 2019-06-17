import React, {Component} from 'react'
import StatusDropdown from '../../common/StatusDropdown';
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {connect} from '../../utils'
import {Button} from "reactstrap"

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

  onSelect = (id, selectedStatus) => {
    this.setState({ [id]: selectedStatus })
  }

  onUpdateClick = (shopitem_id, inventory_id, product_id, e) => {
    e.stopPropagation()
    e.preventDefault()
    console.log(this.state);
    const { timeframe } = this.props;
    const status = this.state[shopitem_id];
    console.log(shopitem_id);
    console.log(status);
    this.adminStore.setShopItemStatus(shopitem_id, status);
  }

  sortByStatus = (a, b) => {
    const sortOrder = ['pending', 'available', 'unavailable', 'purchased']
    return sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status)
  }

  render() {
    let {shopitemsFarms} = this.adminStore
    const {shopitems} = this.props
    const {timeframe} = this.props
    const totalPrice = ({shopitems}) => shopitems && shopitems.reduce((sum, item) => sum + item.estimated_total, 0)
    
    return (
      <Paper elevation={1} className={"scrollable-table"}>
        <Table className={"shopper-table"}>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell align={"right"}>Quantity</TableCell>
              <TableCell>Is Sub?</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Available</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shopitems.sort(this.sortByStatus).map((shopitem, i) => {
      console.log('shopitem :', shopitem);
              return (
                <TableRow
                  key={shopitem._id}
                  className={`row ${shopitem.status} `}
                  onClick={() => this.props.toggleSingleProductView(shopitem, i)}
                >
                  <TableCell component="th" scope="row" padding={"dense"}>
                    {shopitem.product_producer} - {shopitem.product_shop}
                  </TableCell>
                  <TableCell>{shopitem.product_name}</TableCell>
                  <TableCell align="right">
                    {shopitem.quantity} {shopitem.unit_type === "packaging" ? shopitem.packaging_name : (shopitem.unit_type || shopitem.price_unit) }</TableCell>
                  <TableCell>{shopitem.is_substitute}</TableCell>
                  <TableCell>{shopitem.status}</TableCell>
                  <TableCell>
                    <StatusDropdown shopitem={shopitem} onSelect={this.onSelect.bind(this, shopitem._id)} />
                  </TableCell>
                  <TableCell>
                    <Button onClick={this.onUpdateClick.bind(this, shopitem._id, shopitem.inventory_id, shopitem.product_id)}>Update</Button>
                  </TableCell>
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
