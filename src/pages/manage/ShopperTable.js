import React, { Component } from 'react'
import CustomDropdown from '../../common/CustomDropdown'
import {
  Row,
  Col,
  Table,
  Input,
  Button,
} from 'reactstrap'

import { connect } from '../../utils'

const prepareFarmValues = ({ shopitem, other }) => {
  const { product_id, product_producer } = shopitem
  const initial = product_producer
  const restFarms = other && other[product_id] || []
  return [
    initial,
    ...restFarms,
  ]
}

const totalPrice = ({ shopitems }) => shopitems && shopitems.reduce((sum, item) => sum + item.product_price, 0)

const TableHead = () => (
  <thead>
    <tr>
      <th scope="col" width="8%">Organic</th>
      <th scope="col" width="15%">Product</th>
      <th scope="col" width="15%">Farm</th>
      <th scope="col" width="12%">Qty</th>
      <th scope="col" width="10%">Price</th>
      <th scope="col" width="15%">Purchase</th>
      <th scope="col" width="10%">Box #</th>
      <th scope="col" width="15%">Edit/Submit</th>
    </tr>
  </thead>
)

const TableFoot = ({ shopitems }) => (
  <tfoot>
    <tr>
      <td colSpan="4"></td>
      <td colSpan="2"><b>Total Price:</b> ${totalPrice({ shopitems }) / 100}</td>
      <td colSpan="2"></td>
    </tr>
  </tfoot>
)

const TableRow = ({ item, onEditClick }) => (
  <tr>
    <td>{item.organic ? "Y" : "N"}</td>
    <td>{item.product_name}</td>
    <td>{item.product_producer}</td>
    <td>
      <Row noGutters>
        <Col xs="6"><b>Unit:</b></Col>
        <Col xs="6"><b>Qty:</b></Col>
        <Col xs="6">{item.price_unit}</Col>
        <Col xs="6">{item.quantity}</Col>
      </Row>
    </td>
    <td>
      <Row noGutters>
        <Col xs="12">${item.product_price / 100}</Col>
      </Row>
    </td>
    <td></td>
    <td>{item.box_number}</td>
    <td><Button color="info" onClick={onEditClick} prod-id={item.product_id}>Edit Item</Button></td>
  </tr>
)

const TableEditRow = ({ item, shopitemsFarms, onSubmitClick }) => (
  <tr>
    <td>
      <CustomDropdown
        values={["Y", "N"]}
        // onItemClick={}
        title={item.organic ? "Y" : "N"}
      />
    </td>
    <td>
      <Row noGutters>
        <Col xs="12">{item.product_name}</Col>
        <Col xs="12"><Input placeholder="Type in substitute" /></Col>
      </Row>
    </td>
    <td>
      <CustomDropdown
        values={prepareFarmValues({
          shopitem: item,
          other: shopitemsFarms
        })}
        // onItemClick={}
        title={item.product_producer}
      />
    </td>
    <td>
      <Row noGutters>
        <Col xs="6"><b>Unit:</b></Col>
        <Col xs="6"><b>Qty:</b></Col>
        <Col xs="6">{item.price_unit}</Col>
        <Col xs="6">{item.quantity}</Col>
        <Col xs="12"><Input placeholder="Enter actual qty (if different)" /></Col>
      </Row>
    </td>
    <td>
      <Row noGutters>
        <Col xs="12">${item.product_price / 100}</Col>
        <Col xs="12"><Input placeholder="Enter actual price (if different)" /></Col>
      </Row>
    </td>
    <td></td>
    <td>{item.box_number}</td>
    <td><Button color="primary" onClick={onSubmitClick} prod-id={item.product_id}>Submit Item</Button></td>
  </tr>
)

class ShopperTable extends Component {
  constructor(props) {
    super(props)

    this.adminStore = this.props.store.admin
  }

  onEditClick = (e) => {
    const productId = e.target.getAttribute('prod-id')
    this.adminStore.setEditing(productId, true)
  }

  onSubmitClick = (e) => {
    const productId = e.target.getAttribute('prod-id')
    const { timeframe } = this.props

    this.adminStore.setEditing(productId, false)
    this.adminStore.updateShopItem(timeframe, productId)
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
