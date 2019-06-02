import React, {Component} from 'react'
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {connect} from '../../utils'
import {Button, Form, FormGroup, Label, Input} from 'reactstrap'

class ShoppingAppTable extends Component {
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
      shopitemsFarms,
    } = this.adminStore
    const {shopitems} = this.props
    const {timeframe} = this.props
    const totalPrice = ({shopitems}) => shopitems && shopitems.reduce((sum, item) => sum + item.estimated_total, 0)
    const renderStatus = (shopitem) => {
      if (shopitem.completed) {
        return 'Completed'
      } else if (shopitem.missing) {
        return 'Missing'
      } else {
        return 'Incomplete'
      }
    }

    return (
      <Paper elevation={1} className={"scrollable-table"}>
        <Table className={"shopper-table"} >
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
                  key={shopitem.product_id}
                  className={`row ${renderStatus(shopitem).toLocaleLowerCase()} `}
                //   onClick={() => this.props.toggleSingleProductView(shopitem, i)}
                >
                  <TableCell>{shopitem.product_name}</TableCell>
                  <TableCell>
                    {shopitem.quantity} {shopitem.unit_type === "packaging" ? shopitem.packaging_name : shopitem.unit_type }</TableCell>
                  <TableCell>
                    <Form inline>
											<FormGroup className="mr-sm-2" check inline>
												<Label className="mr-sm-1" for="yesSelect" check>Yes</Label>
												<Input type="radio" name="select" id="yesSelect" />
											</FormGroup>
											<FormGroup className="mr-sm-2" check inline>
												<Label className="mr-sm-1" for="noSelect" check>No</Label>
												<Input type="radio" name="select" id="noSelect" />
											</FormGroup>
                    </Form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell align={"center"} colSpan={12}>
                {/* <b>Total Price:</b> ${totalPrice({shopitems}) / 100} */}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

export default connect("store")(ShoppingAppTable)
