import React, { Component } from 'react';

class InviteModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: ''
    }
  }

  componentDidMount() {
    const { user } = this.props.stores

    user.referFriend()
      .then(res => {
        this.setState({
          link: res.data.ref_url
        })
      })
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
    const { link } = this.state

    return (
      <div className="login-wrap">
        <h3 className="m-0 mb-2">Who wants brownie points?</h3>
        <span className="mb-5">
          <small>Share the link below to give your friends free delivery their first month.</small>
        </span>
        <div className="referral-wrap p-2">
          <input
            type="text"
            style={{position: 'absolute', zIndex:-100}}
            value={link}
            ref={el => this.el = el}
          />
          <span className="referral-link">{link}</span>
          <button type="button" className="btn btn-transparent btn-transparent-light" onClick={this.handleCopy}>COPY</button>
        </div>
      </div>
    )
  }
}

export default InviteModal
