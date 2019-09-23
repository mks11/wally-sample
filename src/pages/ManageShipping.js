import React, { Component } from 'react'
import {
  Row,
  Col,
  Container,
} from 'reactstrap'

import Title from '../common/page/Title'
import { BASE_URL } from "../config";
import { connect } from '../utils'

class ManageShipping extends Component {
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
        <Title content="Shipping" />

        {
          <Container>
            <Row>
              <Col>
                <a
                  className="btn btn-main active"
                  href={`${BASE_URL}/api/admin/shipment/label`}
                  target="_blank"
                >
                  Print Shipping Label
                </a>
              </Col>
            </Row>
          </Container>
        }
      </div>
    )
  }
}

export default connect("store")(ManageShipping)
