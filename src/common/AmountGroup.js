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
    selected && amountClick && amountClick(selected, false)
  }

  handleAmountClick = value => {
    const { amountClick } = this.props
    this.setState({ selected: value.type })
    amountClick && amountClick(value, true)
  }

  handleCustomClick = e => {
    const { customClick } = this.props
    this.setState({ selected: 'custom' })
    customClick && customClick()
  }

  render() {
    const { amountValues, selected } = this.state
    let { className, prefix, suffix, groupped = true } = this.props
    prefix = prefix ? prefix : ''
    suffix = suffix ? suffix : ''

    const defaultButtons = amountValues.map((value, index) => (
      <Button
        key={index}
        outline
        type="button"
        className={`amount-btn ${selected === value.type ? 'selected' : ''}`}
        onClick={() => this.handleAmountClick(value)}
      >{`${prefix}${value.type}${suffix}`}</Button>
    ))
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
        {/*customButton*/}
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