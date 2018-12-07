import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap'

class AmountGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountValues: [25, 50, 100],
      selected: null,
    }
  }

  handleAmountClick = value => {
    const { amountClick } = this.props
    this.setState({ selected: value })
    amountClick && amountClick(value)
  }

  handleCustomClick = e => {
    const { customClick } = this.props
    this.setState({ selected: 'custom' })
    customClick && customClick()
  }

  render() {
    const { amountValues, selected } = this.state

    const defaultButtons = amountValues.map((value, index) => (
      <Button
        key={index}
        outline
        type="button"
        className={`gift-amount-btn ${selected === value ? 'selected' : ''}`}
        onClick={() => this.handleAmountClick(value)}
      >{`$${value}`}</Button>
    ))
    const customButton = (
      <Button
        outline
        type="button"
        className={`gift-amount-btn ${selected === 'custom' ? 'selected' : ''}`}
        onClick={this.handleCustomClick}
      >Custom</Button>
    )

    return (
      <ButtonGroup className="gift-amount-btn-group">
        {defaultButtons}
        {customButton}
      </ButtonGroup>
    )
  }
}

export default AmountGroup