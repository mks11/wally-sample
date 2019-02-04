import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import { FB_KEY } from '../config'

class FBLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      facebookRequest: false,
    }
  }

  responseFacebook = responseData => {
    const { onSubmit, userStore }= this.props

    if (!this.state.facebookRequest) {
      this.setState({ facebookRequest: true })

      const { additionalData } = this.props
      const data = { ...responseData, ...additionalData }

      userStore.loginFacebook(data).then(res => {
        onSubmit && onSubmit()
        this.setState({ facebookRequest: false })
      }).catch(e => {
        console.error('Failed to signup', e)
        this.setState({ facebookRequest: false })
      })
    }
  }

  render() {
    const { facebookRequest } = this.state

    return (
      <FacebookLogin
        appId={FB_KEY}
        cssClass={`btn btn-blue-fb ${facebookRequest ? 'inactive' : ''}`}
        autoLoad={false}
        textButton="FACEBOOK"
        fields="name,email,picture"
        scope="public_profile,email"
        callback={this.responseFacebook}
        disableMobileRedirect={true}
      />
    )
  }
}

export default FBLogin
