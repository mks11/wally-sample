import React, { Component } from 'react'
import { Input } from 'reactstrap'

class PromoSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      appliedPromoCode: ''
    }
  }

  onApplyClick = () => {
    const { appliedPromoCode } = this.state
    const { onApply } = this.props
    
    onApply && onApply(appliedPromoCode)
  }

  handleChangePromo = e => {
    this.setState({
      appliedPromoCode: e.target.value
    })
  }

  render() {
    const { appliedPromoCode } = this.state

    return (
      <div className="form-group">
        <span className="text-blue">Have a promo code</span>
        <div className="aw-input--group aw-input--group-sm">
          <Input
            className="aw-input--control aw-input--left aw-input--bordered"
            type="text"
            placeholder="Enter promocode here"
            value={appliedPromoCode}
            onChange={this.handleChangePromo}/>

          <button onClick={this.onApplyClick} type="button" className="btn btn-transparent purple-apply-btn">APPLY</button>
        </div>
      </div>
    )
  }
}

export default PromoSummary