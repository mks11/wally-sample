import React, { PureComponent } from 'react'
import { FormGroup, Input, Row, Col } from 'reactstrap'
import {
  formatMoney
} from 'utils'

class Addons extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      popup: false,
    }
  }

  componentDidMount() {
    const {
      addons,
      onPackagingAddon,
    } = this.props

    onPackagingAddon && onPackagingAddon(addons[0].product_id)
  }

  handlePackagingAddon = e => {
    const { onPackagingAddon } = this.props
    onPackagingAddon && onPackagingAddon(e.target.value)
  }

  handleQuantityAddon = e => {
    const { onQuantityAddon } = this.props
    onQuantityAddon && onQuantityAddon(e.target.value)
  }

  toggleInfoAddon = () => {
    this.setState({ popup: !this.state.popup })
  }

  render () {
    const {
      addons,
      packagingAddon,
      quantityAddon,
    } = this.props
    const { popup } = this.state

    const addonsList = addons.map(addon => `${addon.name} (${formatMoney(addon.inventory[0].price/100)})`)
    const availableAddons = addons.filter((addon) => addon.inventory && addon.inventory.length);

    return (
      <FormGroup className="product-addons">
        <Row form>
          <Col style={{maxWidth: '180px'}} xs="7">
            <div className={popup ? 'open' : ''}>
              <div><strong>Add a packaging add on</strong> <i onClick={this.toggleInfoAddon} className="fa fa-info-circle"></i></div>
              <div className="package-info-popover addon-popover">
                <h4>Packaging Add Ons</h4>
                <p>This item has add-on option(s): {addonsList.join(', ')}. Add-on items are for you to keep, and not to return to us. Simply swap them onto fresh jars of liquids when you order them, and only return the empty jars.</p>
              </div>
            </div>
            <Input type="select" value={packagingAddon} onChange={this.handlePackagingAddon}>
              {
                availableAddons.map((addon) => {
                  const value = `${addon.name} - ${formatMoney(addon.inventory[0].price/100)}`

                  return (
                    <option key={`${addon.name}`} value={addon.product_id}>{`${value} per unit`}</option>
                  )
                })
              }
            </Input>
          </Col>
          <Col style={{maxWidth: '140px'}} xs="5">
            <div><strong>Choose your quantity</strong></div>
            <Input type="select" value={quantityAddon} onChange={this.handleQuantityAddon}>
              {
                [...Array(6).keys()].map(i =>
                  <option key={i} value={i}>{i}</option>
                )
              }
            </Input>
          </Col>
        </Row>
      </FormGroup>
    )
  }
}

export default Addons
