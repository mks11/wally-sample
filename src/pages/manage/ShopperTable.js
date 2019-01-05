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
    let {
      shopitems,
      shopitemsFarms,
    } = this.adminStore
    const { timeframe } = this.props


    // todo remove this
    shopitems =  [
      {
        _id: 1,
        product_id: 'prod_123',
        inventory_id: 'invetory_123',
        organic: true,
        product_name: 'Awesome product',
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
      <Table responsive className="shopper-table">
        <TableHead />
        <tbody>
          {shopitems &&
            shopitems.map(item => {
              return (item.complete === undefined || item.complete) ? (
                <TableRow
                  key={item._id}
                  item={item}
                  onEditClick={this.onEditClick}
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
        <TableFoot {...{ shopitems }} />
      </Table>
    )
  }
}

export default connect("store")(ShopperTable)
