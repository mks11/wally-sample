import React from 'react'
import { FormGroup, Input, Row, Col } from 'reactstrap'

const Addons = ({
  addons,
  packagingAddon,
  quantityAddon,
  onPackagingAddon,
  onQuantityAddon,
}) => {
  return (
    <FormGroup className="product-addons">
      <Row form>
        <Col style={{maxWidth: '180px'}} xs="7">
          <div><strong>Choose your packaging add on</strong></div>
          <Input type="select" value={packagingAddon} onChange={onPackagingAddon}>
            {
              addons.map((addon, i) => {
                const value = `${addon.product_name} - ${addon.inventory[0].price}`
                return (
                  <option key={i} value={addon.product_id}>{`${value} per unit`}</option>
                )
              })
            }
          </Input>
        </Col>
        <Col style={{maxWidth: '140px'}} xs="5">
        <div><strong>Choose your quantity</strong></div>
          <Input type="select" value={quantityAddon} onChange={onQuantityAddon}>
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

export default Addons