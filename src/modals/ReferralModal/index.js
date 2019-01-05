import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class ReferralModal extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      refUrl: ''
    }
  }

  componentDidMount() {
    const { user } = this.props.stores

    user.referFriend()
      .then(res => {
        this.setState({
          refUrl: res.data.ref_url
        })
      })
  }

  handleHere = e => {
    this.props.toggle()
  }

  handleCopy = () => {
    const $el = this.el
    // console.log($el)
    $el.select()
    try {
      var successful = document.execCommand('copy')
      var msg = successful ? 'successfully' : 'unsuccessfully'
      console.log('text coppied ' + msg)
    } catch (err) {
      console.log('Unable to copy text')
    }
  }

  render() {
    const { refUrl } = this.state

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Who wants brownie points?</h3>
        <span className="mb-1">
        An organized pantry, a farm fresh apple, and skipping single-use plastics - share these and other little joys when you refer a friend to The Wally Shop, and you’ll both get 15% off your orders for 30 days.
        </span>
        <p className="mb-5 text-center"><small>Details <Link to="/help/topics/5bd1d5d71ee5e4f1d0b42c27" onClick={this.handleHere}>here</Link></small></p>
        <div className="referral-wrap p-2">
          <input
            type="text"
            style={{ position: 'absolute', zIndex:-100 }}
            value={refUrl}
            ref={el => this.el = el}
            readOnly
          />
          <span className="referral-link">{refUrl}</span>
          <button type="button" className="btn btn-transparent btn-transparent-light" onClick={this.handleCopy}>COPY</button>
        </div>
      </div>
    )
  }
}

export default ReferralModal
