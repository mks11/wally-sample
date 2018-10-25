
import React, { Component } from 'react';
import qs from 'qs'
import { connect } from '../utils'


class Signup extends Component {
  constructor(props, context) {
    super(props, context);
    
    this.routing = this.props.store.routing
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    const query = this.props.location.search
    const qParse = qs.parse(query, { ignoreQueryPrefix: true })

    this.userStore.getStatus(true)
      .then((status) => {
        if (!status) {
          if (qParse.ref) {
            this.userStore.refPromo = qParse.ref
          }
          this.props.store.routing.push('/invitefriends')
        } else {
          this.props.store.routing.push('/main')
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/main')
      })
  }

  handleSignup() {
    this.modalStore.toggleSignup()
    this.routing.push('/main')
  }

  render() {
    return null
  }
}

export default connect("store")(Signup);
