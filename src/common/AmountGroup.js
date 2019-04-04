import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap'

class AmountGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountValues: props.values || [],
      selected: props.selected || null,
      weights: props.weights || [],
      unit_type: props.unit_type || "",
      custom: props.custom || false,
      product: props.product || false
    }
  }

  componentDidMount() {
    const { selected } = this.state
    const { amountClick } = this.props
    selected && amountClick && amountClick(selected, false)
  }

  handleAmountClick = value => {
    const { amountClick } = this.props
    const { product } = this.state
    if (product) {
      this.setState({ selected: value.type })
    } else {
      this.setState({ selected: value })
    }
    
    amountClick && amountClick(value, true)
  }

  handleCustomClick = e => {
    const { customClick } = this.props
    this.setState({ selected: 'custom' })
    customClick && customClick()
  }

  render() {
    const { amountValues, selected, weights, unit_type, product, custom } = this.state
    let { className, prefix, suffix, groupped = true } = this.props
    prefix = prefix ? prefix : ''
    suffix = suffix ? suffix : ''
    let defaultButtons = [];

    if (product) {
      defaultButtons = amountValues.map((value, index) => (
        <Button
          key={index}
          outline
          type="button"
          className={`amount-btn ${selected === value.type ? 'selected' : ''}`}
          onClick={() => this.handleAmountClick(value)}
        >{`${prefix}${value.type.slice(0, -1)}, ${Math.round(100*weights[index])/100} ${unit_type})${suffix}`}</Button>
      ))
    } else {
      defaultButtons = amountValues.map((value, index) => (
        <Button
          key={index}
          outline
          type="button"
          className={`amount-btn ${selected === value ? 'selected' : ''}`}
          onClick={() => this.handleAmountClick(value)}
        >{`${prefix}${value}${suffix}`}</Button>
      ))
    }
    const customButton = (
      <Button
        outline
        type="button"
        className={`amount-btn ${selected === 'custom' ? 'selected' : ''}`}
        onClick={this.handleCustomClick}
      >Custom</Button>
    )

    const buttons = (
      <React.Fragment>
        {defaultButtons}
        {custom ? customButton : null}
      </React.Fragment>
    )


    return (
      groupped
        ? (
          <ButtonGroup className={`${className} amount-btn-group`}>
            {buttons}
          </ButtonGroup>
        )
        : (
          <div className={`${className} button-custom-group`}>
            {buttons}
          </div>
        )
    )
  }
}

export default AmountGroup