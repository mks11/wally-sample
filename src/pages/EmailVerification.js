import React, { Component } from 'react';
import qs from 'qs'
import { connect } from 'utils'

class EmailVerification extends Component {
  constructor(props) {
    super(props)

    this.modalStore = this.props.store.modal
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    const query = this.props.location.search
    const parsedQuery = qs.parse(query, { ignoreQueryPrefix: true })

    const {
      email,
      token_id,
    } = parsedQuery

    if(email && token_id) {
      this.userStore.verifyWaitlistEmail(email, token_id)
        .then(res => {
          if (res.verified) {
            this.userStore.getWaitlistInfo({ email: email })
              .then(res => {
                this.modalStore.toggleModal('waitinglist', null, res)
              }).catch(() => {
                this.modalStore.toggleModal('error', 'Something went wrong during your request')
              })
          } else {
            this.modalStore.toggleModal('emailverification', 'error')
          }
        })
        .catch(() => {
          this.modalStore.toggleModal('emailverification', 'error')
        })
    }

    this.props.store.routing.push('/')
  }

  render() {
    return null
  }
}

export default connect("store")(EmailVerification);
