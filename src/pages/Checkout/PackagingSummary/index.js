import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ClickOutside from 'react-click-outside'
import FontAwesome from 'react-fontawesome'

class PackagingSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      packagingdeposit: false
    }
  }

  showPackagingPopup = () => {
    this.setState({ packagingdeposit: true })
  }

  hidePackagingPopup = () => {
    this.setState({ packagingdeposit: false })
  }

  render() {
    const { packagingdeposit } = this.state
    const { value } = this.props

    return (
      <div className={`summary ${packagingdeposit ? 'open' : ''}`}>
        <ClickOutside onClickOutside={this.hidePackagingPopup}>
          <div
            className="popover bs-popover-right"
            role="tooltip"
            x-placement="right"
            style={{ left: '142px' }}
          >
            <div className="arrow"></div>
            <h3 className="popover-header"></h3>
            <div className="popover-body">
              This charge correlates to how many pieces of reusable packaging we lend you. Once you return our reusable packaging to a Wally Shop courier, you'll get the deposit back as store credit. <Link className="text-violet" to={"/help/topics/5b9158285e3b27043b178f90"}>Learn more</Link>
            </div>
          </div>
        </ClickOutside>
        <span onClick={this.showPackagingPopup}>Packaging deposit  <FontAwesome name='info-circle' /></span>
        <span>{value}</span>
      </div>
    )
  }
}

export default PackagingSummary