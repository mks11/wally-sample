import { Component } from 'react';
import { connect } from '../utils'

class ReferFriend extends Component {
  constructor(props) {
    super(props)

    this.userStore = this.props.store.user
    this.modalStore = this.props.store.modal
  }

  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        if (!status) {
          this.props.store.routing.push('/main')
        } else {
          this.userStore.referFriend()
          this.modalStore.toggleReferral()
          this.props.store.routing.push('/main')
        }
      })
  }

  render() {
    return null
  }
}

export default connect("store")(ReferFriend);
