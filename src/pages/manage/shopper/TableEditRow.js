import React, { Component } from 'react'
import CustomDropdown from '../../../common/CustomDropdown'
import { connect } from '../../../utils'
import {
  Row,
  Col,
  Input,
  Button,
} from 'reactstrap'
import ModalProductChange from './ModalProductChange'
import ModalFarmChange from './ModalFarmChange'
import ModalPriceChange from './ModalPriceChange'

const prepareFarmValues = ({ shopitem, other }) => {
  const { product_id, product_producer } = shopitem
  const initial = product_producer
  const restFarms = (other && other[product_id]) || []
  return [...new Set([ initial, ...restFarms ])]    
}

class TableEditRow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialItem: props.item,
      item: props.item
    }

    this.modalStore = this.props.store.modal
  }

  onValueChange(property, newvalue) {
    const { item } = this.state

    if (newvalue.length || newvalue > 0) {
      const { [property.toString()]: omit, ...rest } = item
      this.setState({
        item: {
          ...rest,
          [property]: newvalue,
        }
      })
    }
  }

  onProductNameChange = (e) => {
    const newvalue = e.target.value
    if (newvalue.length) {
      this.onValueChange('product_name', newvalue)
      this.modalStore.toggleChangeProduct()
    }
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

    this.modalStore.toggleChangeFarm()
  }

  onPriceChange = (e) => {
    const { initialItem } = this.state
    const newvalue = parseFloat(e.target.value) * 100
    newvalue >= initialItem.product_price * 1.2 && this.modalStore.toggleChangePrice() // above 20% increase
    this.onValueChange('product_price', newvalue)
  }

  onQtyChange = (e) => {
    const newvalue = parseInt(e.target.value)
    this.onValueChange('quantity', newvalue)
  }

  onPriceReasonChange = (reason) => {
    this.onValueChange('price_substitute_reason', reason)
  }

  onFarmReasonChange = (reason) => {
    this.onValueChange('farm_substitue_reason', reason)
  }

  onProductReasonChange = (reason) => {
    this.onValueChange('product_substitute_reason', reason)
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
      <React.Fragment>
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
              <Col xs="12">{this.state.item.product_substitute_reason !== '' ? this.state.item.product_substitute_reason : ''}</Col>
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
            <div>{this.state.item.farm_substitue_reason !== '' ? this.state.item.farm_substitue_reason : ''}</div>
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
              <Col xs="12">{this.state.item.price_substitute_reason !== '' ? this.state.item.price_substitute_reason : ''}</Col>
            </Row>
          </td>
          <td></td>
          <td>{item.box_number}</td>
          <td><Button color="primary" onClick={this.onSubmit} prod-id={item.product_id}>Submit Item</Button></td>
        </tr>
        <ModalProductChange onSubmit={this.onProductReasonChange} />
        <ModalFarmChange onSubmit={this.onFarmReasonChange} />
        <ModalPriceChange onSubmit={this.onPriceReasonChange} />
      </React.Fragment>
    )
  }
}

export default connect("store")(TableEditRow)