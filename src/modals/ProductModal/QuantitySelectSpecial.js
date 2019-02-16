import React, { PureComponent } from 'react'
import { FormGroup, Input, Row, Col } from 'reactstrap'

class QuantitySelectSpecial extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      innerValue: props.value,
      disabled: true,
      customValue: '',
    }
  }

  componentDidUpdate(prevProps) {
    const newValue = this.props.value

    if (newValue !== prevProps.value && this.state.disabled) {
      if (![...Array(5).keys()].includes(newValue - 1) ) {
        this.setState({
          innerValue: 'custom',
          disabled: false,
          customValue: newValue
        })
      } else {
        this.setState({
          innerValue: newValue
        })
      }
    }
  }

  handleSelectChange = e => {
    const {
      onSelectChange,
      onCustom,
    } = this.props

    const notCustom = e.target.value !== 'custom'

    this.setState({
      innerValue: e.target.value,
      disabled: notCustom,
      customValue: '',
    })

    notCustom && onSelectChange && onSelectChange(e)
    onCustom && onCustom(notCustom)
  }

  handleCustomValueChange = e => {
    const {
      onSelectChange,
    } = this.props

    const value = e.target.value
    
    // only positive float is allowed with dot separator
    if (/^\d*[.]?\d*$/.test(value)) {
      this.setState({ customValue: value })
      onSelectChange && onSelectChange(e)
    }
  }

  render() {
    const { price_unit } = this.props

    const {
      innerValue,
      disabled,
      customValue,
    } = this.state

    return (
      <FormGroup>
        <Row form>
          <Col style={{maxWidth: '140px'}} xs="6">
            <Input type="select" value={innerValue} onChange={this.handleSelectChange}>
              {
                [...Array(5).keys()].map(i =>
                  <option key={i} value={i + 1}>{`${i + 1} ${price_unit}`}</option>
                )
              }
              <option value="custom">Custom</option>
            </Input>
          </Col>
          <Col style={{maxWidth: '140px'}} xs="6">
            <Input
              type="text"
              className="product-custom-value"
              disabled={disabled}
              value={customValue}
              onChange={this.handleCustomValueChange}
            />
          </Col>
        </Row>
      </FormGroup>
    )
  }
}

export default QuantitySelectSpecial