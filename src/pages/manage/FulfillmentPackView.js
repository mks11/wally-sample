import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Table,
} from 'reactstrap'
import { connect } from '../../utils'

class FulfillmentPackView extends Component {
  constructor(props) {
    super(props)

    this.adminStore = this.props.store.admin
  }

  render() {
    return (
      <Container>
        <h2 className="py-3">Pack:</h2>
        <Table responsive className="pack-table">
        </Table>
      </Container>
    )
  }
}

export default connect('store')(FulfillmentPackView)
