import React, { Component } from 'react'
import { Container } from 'reactstrap'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
} from '@material-ui/core'

import Title from 'common/page/Title'
import { BASE_URL } from 'config';
import { connect } from 'utils'

class ManageCoPackingRunsSpecific extends Component {
  constructor(props) {
    super(props)

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.contentStore = props.store.content
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
          this.props.store.routing.push('/')
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  render() {
    return (
      <div className="App">
        <Title content="Co-Packing Run - Specific" />
      </div>
    )
  }
}

export default connect("store")(ManageCoPackingRunsSpecific)
