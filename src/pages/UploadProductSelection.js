import React, { Component } from 'react'
import { Container } from 'reactstrap'
import {connect} from '../utils'

class UploadProductSelection extends Component {
  constructor(props) {
    super(props)
    this.userStore = this.props.store.user
  }
  
  componentDidMount() {
    console.log('userStore', this.userStore)
    this.userStore.getStatus(true)
      .then(status => {
        const user = this.userStore.user
          if (!status || user.type !== "admin" || user.type != "super-admin" ) {
            this.props.store.routing.push('/')
          } 
      })
      .catch( error => {
        this.props.store.routing.push('/')
      })
  }

  render () {
    if (!this.userStore.user) return null
    return (
      <div className="App">
        <Container>
            <h1>Hello</h1>
        </Container>
      </div>
    )

  }
}

export default connect("store")(UploadProductSelection);



