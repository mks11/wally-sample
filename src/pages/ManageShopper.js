import React, { Component } from 'react';
import { Input  } from 'reactstrap'
import Title from '../common/page/Title'

import { connect } from '../utils'

class ManageShopper extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.userStore = this.props.store.user
    this.uiStore = this.props.store.ui
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
          this.props.store.routing.push('/')
        }
      })
  }

  render() {
    if (!this.userStore.user) return null
      
    return (
      <div className="App">
        <Title content="Shopper Portal" />

        <section className="page-section aw-account--details pt-1">
          <div className="container">
            <h2>Account Details</h2>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(ManageShopper);
