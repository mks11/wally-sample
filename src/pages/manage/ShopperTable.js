import React from 'react'
import CustomDropdown from '../../common/CustomDropdown'
import {
  Row,
  Col,
  Table,
  Input,
} from 'reactstrap'

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
      <th scope="col" width="10%">Organic</th>
      <th scope="col" width="15%">Product</th>
      <th scope="col" width="15%">Farm</th>
      <th scope="col" width="12%">Qty</th>
      <th scope="col" width="8%">Price</th>
      <th scope="col" width="15%">Purchase</th>
      <th scope="col" width="10%">Box #</th>
      <th scope="col" width="15%">Edit Item</th>
    </tr>
  </thead>
)

const TableFoot = ({ shopitems }) => (
  <tfoot>
    <tr>
      <td colSpan="3"></td>
      <td colSpan="2"><b>Total Price:</b> ${totalPrice({ shopitems }) / 100}</td>
      <td colSpan="3"></td>
    </tr>
  </tfoot>
)

const ShopperTable = ({ shopitems, shopitemsFarms }) => (
  <Table responsive>
    <TableHead />
    <tbody>
      {shopitems &&
        shopitems.map(item => {
          return (
            <tr key={item.product_id}>
              <td>
                <CustomDropdown
                  values={["Y", "N"]}
                  // onItemClick={}
                  title={item.organic ? "Y" : "N"}
                />
              </td>
              <td>{item.product_name}</td>
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
            </tr>
          );
        })}
    </tbody>
    <TableFoot {...{ shopitems }} />
  </Table>
)

export default ShopperTable
