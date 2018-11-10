import React, { Component } from 'react';
import { connect } from '../utils'

class CartAdd extends Component {
  constructor(props) {
    super(props)

    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        if (!status) {
          this.modalStore.toggleLogin()
          this.props.store.routing.push('/main')
        } else {
          this.props.store.routing.push('/main')
        }
        this.userStore.cameFromCartUrl = true
      })
  }

  render() {
    return null
  }
}

export default connect("store")(CartAdd);
