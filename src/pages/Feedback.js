import { Component } from 'react';
import qs from 'qs'
import { connect } from '../utils'

class Feedback extends Component {
  constructor(props) {
    super(props)

    this.modalStore = this.props.store.modal
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    const query = this.props.location.search
    const parsedQuery = qs.parse(query, { ignoreQueryPrefix: true })

    const {
      feedback,
      email,
      order,
    } = parsedQuery

    if(feedback && email && order) {
      this.userStore.feedback = {
        value: feedback,
        email: email,
        order: order,
      }
      this.modalStore.toggleFeedback()
    }
    
    this.props.store.routing.push('/main')
  }

  render() {
    return null
  }
}

export default connect("store")(Feedback);
