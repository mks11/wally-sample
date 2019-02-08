import React, { Component } from 'react'
import ClickOutside from 'react-click-outside'
import FontAwesome from 'react-fontawesome'

class TippingSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tippingpopup: false
    }
  }

  showTippingPopup = () => {
    this.setState({ tippingpopup: true })
  }

  hideTippingPopup = () => {
    this.setState({ tippingpopup: false })
  }

  render() {
    const { tippingpopup } = this.state
    const { value } = this.props

    return (
      <div className={`summary ${tippingpopup ? 'open' : ''}`}>
        <ClickOutside onClickOutside={this.hideTippingPopup}>
          <div
            className="popover bs-popover-right"
            role="tooltip"
            x-placement="right"
            style={{ left: '142px' }}
          >
            <div className="arrow"></div>
            <h3 className="popover-header"></h3>
            <div className="popover-body">
              100% of the tip amount goes to our shoppers and couriers, on top of the wages they earn.
            </div>
          </div>
        </ClickOutside>
        <span onClick={this.showTippingPopup}>Tip Amount  <FontAwesome name='info-circle' /></span>
        <span>{value}</span>
      </div>
    )
  }
}

export default TippingSummary