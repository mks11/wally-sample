import React from 'react'
import {
  Row,
  Col,
  Button,
} from 'reactstrap'


const TableRow = ({ item, onEditClick }) => (
  <tr>
    <td>{item.organic ? 'Y' : 'N'}</td>
    <td>{item.substitue_for_name || item.product_name}</td>
    <td>{item.product_producer}</td>
    <td>
      <Row noGutters>
        <Col>
          <Row>
            <Col><b>Unit:</b></Col>
            <Col>{item.price_unit}</Col>
          </Row>
        </Col>
        <Col xs="6">
          <Row>
            <Col><b>Qty:</b></Col>
            <Col>{item.quantity}</Col>
          </Row>
        </Col>
      </Row>
    </td>
    <td>
      <Row noGutters>
        <Col xs="12">${item.product_price / 100}</Col>
      </Row>
    </td>
    <td>{item.missing ? 'Missing' : 'Purchased'}</td>
    <td>{item.box_number}</td>
    <td><Button color="info" onClick={onEditClick} prod-id={item.product_id}>Edit Item</Button></td>
  </tr>
)

export default TableRow