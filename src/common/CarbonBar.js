import React, { Component } from 'react'
import ClickOutside from 'react-click-outside'

class CarbonBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showInfo: false
    }
  }

  toggleCarbonBarInfo = () => {
    this.setState({ showInfo: !this.state.showInfo })
  }

  hideCarbonBarInfo = () => {
    this.setState({ showInfo: false })
  }

  render() {
    const { showInfo } = this.state
    const {
      show = true,
      value = 1,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <div className="carbon-bar-wrapper">
        <div className={`carbon-bar-info package-info ${showInfo ? 'open' : ''}`}>
          {value ? (10 - (value % 10)) : 10} items from fully minimizing your carbon footprint <i onClick={this.toggleCarbonBarInfo} className="fa fa-info-circle" />
          <ClickOutside onClickOutside={this.hideCarbonBarInfo}>
            <div className="package-info-popover">
              <p>Our totes are designed to hold 10 jars. By fully utilizing a tote, you are minimizing the carbon effects of your order</p>
            </div>
          </ClickOutside>
        </div>
        <div className="carbon-bar">
          <div
            className="carbon-bar-value"
            style={{ width: `${value * 10}%` }}
          />
        </div>
      </div>
    )
  }
}

export default CarbonBar
