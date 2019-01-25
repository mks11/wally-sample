import React, { Component } from 'react'
import { logModalView, logEvent } from 'utils'
import DeliveryTimeOptions from 'common/DeliveryTimeOptions'


class DeliveryModal extends Component {
  constructor(props) {
    super(props)

    const { checkout } = this.props.stores

    this.state = {
      deliveryTimes: checkout.deliveryTimes,
      selectedTime: null,
    }
  }

  handleSubmit = () => {
    const { user, checkout } = this.props.stores

    if (this.state.selectedTime) {
      logEvent({ category: "DeliveryOptions", action: "SubmitDeliveryOptions" })
      user.setDeliveryTime(this.state.selectedTime)
      this.props.toggle()
      checkout.getDeliveryTimes()
      // this.props.onChangeSubmit && this.props.onChangeSubmit()
    }
  }

  handleSelectTime = data => {
    this.setState({ selectedTime: data })
  }

  handleCloseModal = () => {
    logEvent({ category: "DeliveryOptions", action: "CloseDeliveryOptionsWindow" })
    this.props.toggle()
  }

  render() {
    const { selectedTime, deliveryTimes } = this.state
    const { user } = this.props.stores

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Select delivery time</h3>
        <div className="">
          <div >
            <DeliveryTimeOptions
              lock={false}
              data={deliveryTimes}
              selected={user.selectedDeliveryTime}
              onSelectTime={this.handleSelectTime}
            />
          </div>
        <div><br></br></div>
        <div className="font-italic mb-1 text-center">Order by 2:00PM for same day delivery</div>
        <button onClick={this.handleSubmit} className={`btn btn-main mt-3 ${selectedTime ? 'active' : ''}`}>Submit</button>
        </div>
      </div>
    )
  }
}

export default DeliveryModal