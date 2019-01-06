import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap'

class AmountGroup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      amountValues: props.values || [],
      selected: props.selected || null,
    }
  }

  componentDidMount() {
    const { selected } = this.state
    const { amountClick } = this.props
    selected && amountClick && amountClick(selected)
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
    const { className } = this.props

    const defaultButtons = amountValues.map((value, index) => (
      <Button
        key={index}
        outline
        type="button"
        className={`amount-btn ${selected === value ? 'selected' : ''}`}
        onClick={() => this.handleAmountClick(value)}
      >{`$${value}`}</Button>
    ))
    const customButton = (
      <Button
        outline
        type="button"
        className={`amount-btn ${selected === 'custom' ? 'selected' : ''}`}
        onClick={this.handleCustomClick}
      >Custom</Button>
    )

    return (
      <ButtonGroup className={`${className} amount-btn-group`}>
        {defaultButtons}
        {customButton}
      </ButtonGroup>
    )
  }
}

export default AmountGroup