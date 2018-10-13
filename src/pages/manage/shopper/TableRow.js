import React from 'react'
import {
  Row,
  Col,
  Button,
} from 'reactstrap'


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

export default TableRow