import React, { PureComponent } from 'react'
import CustomDropdown from '../../../common/CustomDropdown'
import {
  Row,
  Col,
  Input,
  Button,
} from 'reactstrap'

const prepareFarmValues = ({ shopitem, other }) => {
  const { product_id, product_producer } = shopitem
  const initial = product_producer
  const restFarms = (other && other[product_id]) || []
  return [...new Set([ initial, ...restFarms ])]    
}

class TableEditRow extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      item: props.item
    }
  }

  onValueChange(property, newvalue) {
    const { item } = this.state

    if (newvalue.length || newvalue > 0) {
      const { [property.toString()]: omit, ...rest } = item

      this.setState({
        item: {
          [property]: newvalue,
          ...rest,
        }
      })
    }
  }

  onProductNameChange = (e) => {
    const newvalue = e.target.value
    this.onValueChange('product_name', newvalue)

    // ask
  }

  onOrgaincChange = (newvalue) => {
    const value = newvalue === 'Y'
    const { item } = this.state
    const { organic, ...rest } = item

    this.setState({
      item: {
        organic: value,
        ...rest,
      }
    })
  }

  onFarmChange = (newvalue) => {
    const { item } = this.state

    if (newvalue !== item.product_producer) {
      const { product_producer, ...rest } = item

      this.setState({
        item: {
          product_producer: newvalue,
          ...rest,
        }
      })
    }

    //ask 
  }

  onPriceChange = (e) => {
    const newvalue = parseFloat(e.target.value) * 100
    this.onValueChange('product_price', newvalue)

    //ask
  }

  onQtyChange = (e) => {
    const newvalue = parseInt(e.target.value)
    this.onValueChange('quantity', newvalue)
  }

  onSubmit = (e) => {
    const productId = e.target.getAttribute('prod-id')
    const { onSubmitClick } = this.props
    const { item } = this.state

    onSubmitClick && onSubmitClick(productId, item)
  }

  render() {
    const { item, shopitemsFarms } = this.props

    return (
      <tr>
        <td>
          <CustomDropdown
            values={["Y", "N"]}
            onItemClick={this.onOrgaincChange}
            title={item.organic ? "Y" : "N"}
          />
        </td>
        <td>
          <Row noGutters>
            <Col xs="12">{item.product_name}</Col>
            <Col xs="12"><Input placeholder="Type in substitute" onBlur={this.onProductNameChange} /></Col>
          </Row>
        </td>
        <td>
          <CustomDropdown
            values={prepareFarmValues({
              shopitem: item,
              other: shopitemsFarms
            })}
            onItemClick={this.onFarmChange}
            title={item.product_producer}
          />
        </td>
        <td>
          <Row noGutters>
            <Col xs="6"><b>Unit:</b></Col>
            <Col xs="6"><b>Qty:</b></Col>
            <Col xs="6">{item.price_unit}</Col>
            <Col xs="6">{item.quantity}</Col>
            <Col xs="12"><Input placeholder="Enter actual qty (if different)" onBlur={this.onQtyChange} /></Col>
          </Row>
        </td>
        <td>
          <Row noGutters>
            <Col xs="12">${item.product_price / 100}</Col>
            <Col xs="12"><Input placeholder="Enter actual price (if different)" onBlur={this.onPriceChange} /></Col>
          </Row>
        </td>
        <td></td>
        <td>{item.box_number}</td>
        <td><Button color="primary" onClick={this.onSubmit} prod-id={item.product_id}>Submit Item</Button></td>
      </tr>
    )
  }
}

export default TableEditRow