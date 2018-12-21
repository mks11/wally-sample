import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { validateEmail } from '../../utils'

class InvalidZipModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      invalidText: ''
    }
  }

  handleSubmit = e => {
    const { email } = this.state
    const { zip } = this.props.stores

    if (!email) return

    if (!validateEmail(email)) {
      this.setState({ invalidText: 'Email not valid' })
      return
    }

    zip.subscribeNotifications({
      email: email,
      zip: zip.selectedZip,
      subscribe: false
    }).then(() => {
        this.props.switchTo('invalidzipsuccess')
      }).catch((e) => {
        console.error('Failed to subscribe', e)
        const msg = e.response.data.error.message
        this.setState({ invalidText: msg })
      })
    e.preventDefault()
  }

  handleValueChange = e => {
    this.setState({ email: e.target.value })
  }

  render() {
    const { email, invalidText } = this.state

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Hope to be there soon!</h3>
        <span className="mb-5">Sign up to be notified once we are.</span>
        <form>
          <Input
            className="aw-input--control aw-input--center aw-input--bordered mb-5"
            type="text"
            placeholder="Enter your email"
            onChange={this.handleValueChange}
          />
          {
            invalidText
              ? <div><span className="text-error text-center my-3">{invalidText}</span></div>
              : null
          }
          <button className={`btn btn-main ${email ? 'active' : ''}`} onClick={this.handleSubmit}>SUBMIT</button>
        </form>
      </div>
    )
  }
}

export default InvalidZipModal
