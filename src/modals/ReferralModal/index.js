import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { logEvent, logModalView, logPageView } from '../../utils'

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
    logEvent({ category: "Refer", action: "CopyReferralLink" })
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
        <h3 className="m-0 mb-2">Give $10, Get $10</h3>
        <span className="mb-1">
          <small>Give $10, and get $10 for every friend who places their first order.</small>
        </span>
        <p className="mb-5 text-center"><small>Share the joys of skipping single-use when you refer a friend to The Wally Shop using the link below - Details <Link to="/help/detail/5bd1d6c31ee5e4f1d0b42c29" onClick={this.handleHere}>here.</Link></small></p>
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
