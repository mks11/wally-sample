import { Component } from 'react';
import { connect, logModalView } from '../utils'
import ReactGA from 'react-ga';

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
          ReactGA.pageview(window.location.pathname);
          logModalView('/refer');
          this.modalStore.toggleModal('referral')
          this.props.store.routing.push('/main')
        }
      })
  }

  render() {
    return null
  }
}

export default connect("store")(ReferFriend);
