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

  handleSelectAvailability = async(isAvailable, shopitemId) => {
    if (isAvailable) {
      const status = 'available'
      await this.adminStore.setShopItemStatus(status, shopitemId)
    } else {
      const status = 'missing'
      await this.adminStore.setShopItemStatus(status, shopitemId)
      // open step 1 and 2 missing popup
    }
  }

  render() {
    const {shopitems} = this.props
    const renderStatus = (shopitem) => {
      if (shopitem.completed) {
        return 'completed'
      } else if (shopitem.missing) {
        return 'missing'
      } else {
        return 'incomplete'
      }
    }

    return (
      <Paper elevation={1} className={"scrollable-table"}>
        <Table className={"shopping-app-table"} >
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
                  className={`row ${renderStatus(shopitem).toLocaleLowerCase()}`}
                >
                  <TableCell>{shopitem.product_name}</TableCell>
                  <TableCell>
                    {shopitem.quantity} {shopitem.unit_type === "packaging" ? shopitem.packaging_name : shopitem.unit_type }</TableCell>
                  <TableCell>
                    <Form inline>
											<FormGroup className="mr-sm-2" check inline>
												<Label className="mr-sm-1" for="yesSelect" check>Yes</Label>
												<Input type="radio" name="select" id="yesSelect"
                        onChange={() => this.handleSelectAvailability(true, shopitem._id)} />
											</FormGroup>
											<FormGroup className="mr-sm-2" check inline>
												<Label className="mr-sm-1" for="noSelect" check>No</Label>
												<Input type="radio" name="select" id="noSelect"
                        onChange={() => this.handleSelectAvailability(false, shopitem._id)} />
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
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    )
  }
}

export default connect("store")(ShoppingAppTable)
