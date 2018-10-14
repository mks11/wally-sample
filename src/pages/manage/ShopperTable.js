import React, { Component } from 'react'
import {
  Table,
} from 'reactstrap'
import TableHead from './shopper/TableHead'
import TableFoot from './shopper/TableFoot'
import TableRow from './shopper/TableRow'
import TableEditRow from './shopper/TableEditRow'
import { connect } from '../../utils'

class ShopperTable extends Component {
  constructor(props) {
    super(props)

    this.adminStore = this.props.store.admin
  }

  onEditClick = (e) => {
    const productId = e.target.getAttribute('prod-id')
    this.adminStore.setEditing(productId, true)
  }

  onSubmitClick = (productId, updateditem) => {
    const { timeframe } = this.props
    const { complete, ...rest } = updateditem

    this.adminStore.setEditing(productId, false)
    this.adminStore.updateShopItem(timeframe, productId, rest)
  }

  render() {
    const {
      shopitems,
      shopitemsFarms,
    } = this.adminStore

    return (
      <Table responsive className="shopper-table">
        <TableHead />
        <tbody>
          {shopitems &&
            shopitems.map(item => {
              return (item.complete === undefined || item.complete) ? (
                <TableRow
                  key={item.product_id}
                  item={item}
                  onEditClick={this.onEditClick}
                />
              ) : (
                <TableEditRow
                  key={item.product_id}
                  item={item}
                  shopitemsFarms={shopitemsFarms}
                  onSubmitClick={this.onSubmitClick}
                />
              )
            })}
        </tbody>
        <TableFoot {...{ shopitems }} />
      </Table>
    )
  }
}

export default connect("store")(ShopperTable)
