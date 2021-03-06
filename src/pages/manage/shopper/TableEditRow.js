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
  return [...new Set([ initial, ...restFarms ])].map(item => {
    return { id: item, title: item }
  })
}

class TableEditRow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialItem: props.item,
      item: props.item,
      missingNote: ''
    }

    this.modalStore = this.props.store.modal
    this.adminStore = this.props.store.admin
  }

  onValueChange(property, newvalue) {
    const { item } = this.state

    if (newvalue.length || newvalue > 0 || typeof(newvalue) === typeof(true)) {
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
      this.onValueChange('substitue_for_name', newvalue)
      this.modalStore.toggleChangeProduct()

      const { item } = this.state
      const { timeframe } = this.props
      const payload = {
        product_id: item.product_id,
        inventory_id: item.inventory_id,
        organic: item.organic,
      }
      this.adminStore.updateShopItemQuantity(timeframe, item._id, payload)
    }
  }

  onOrgaincChange = (newvalue) => {
    this.onValueChange('organic', newvalue === 'true')
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
    const newvalue = parseInt(e.target.value, 10)
    this.onValueChange('final_quantity', newvalue)
  }

  onBoxNumberChange = (e) => {
    const newvalue = e.target.value
    this.onValueChange('box_number', newvalue)
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

  onPurchaseChange = (state) => {
    this.onValueChange('missing', state === 'Missing')
  }

  onPurchaseMissingChange = (reason) => {
    const { missingNote } = this.state
    this.onValueChange('product_missing_reason', `${reason} ${missingNote}`)
  }

  onMissingNoteChange = (e) => {
    const note = e.target.value
    const { item } = this.state 
    this.onValueChange('product_missing_reason', `${item.product_missing_reason} ${note}`)
    this.setState({
      missingNote: note
    })
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
              values={
                item.organic
                ? [{ id: 'true', title: "Y" }, { id: 'false', title: "N" }]
                : [{ id: 'false', title: "N" }, { id: 'true', title: "Y" }]
              }
              onItemClick={this.onOrgaincChange}
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
            />
            <div>{this.state.item.farm_substitue_reason !== '' ? this.state.item.farm_substitue_reason : ''}</div>
          </td>
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
          <td>
            <CustomDropdown
              values={[{ id: 'Purchased', title: 'Purchased' }, { id: 'Missing', title: 'Missing' }]}
              onItemClick={this.onPurchaseChange}
            />
            {
              this.state.item.missing && 
                (<React.Fragment>
                  <CustomDropdown
                    values={[{ id: 'Temp OOS', title: 'Temp OOS' }, { id: 'Season OOS', title: 'Season OOS' }, { id: 'Perm OOS', title: 'Perm OOS' }]}
                    onItemClick={this.onPurchaseMissingChange}
                  />
                  <Input placeholder="Enter any notes you might have" onBlur={this.onMissingNoteChange} />
                </React.Fragment>)
            }
          </td>
          <td>
            <Row noGutters>
              <Col xs="12">{item.box_number}</Col>
              <Col xs="12"><Input placeholder="Type in substitute" onBlur={this.onBoxNumberChange} /></Col>
            </Row>
          </td>
          <td><Button color="primary" onClick={this.onSubmit} prod-id={item._id}>Submit Item</Button></td>
        </tr>
        <ModalProductChange onSubmit={this.onProductReasonChange} />
        <ModalFarmChange onSubmit={this.onFarmReasonChange} />
        <ModalPriceChange onSubmit={this.onPriceReasonChange} />
      </React.Fragment>
    )
  }
}

export default connect("store")(TableEditRow)