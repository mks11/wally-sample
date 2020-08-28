import React, { Component } from "react";
import moment from "moment";
import { Row, Col, Container } from "reactstrap";

import Title from "../common/page/Title";
import { BASE_URL } from "../config";
import { connect } from "../utils";

class ManagePrinting extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.adminStore = props.store.admin;
    this.contentStore = props.store.content;
  }

  componentDidMount() {
    this.userStore
      .getStatus()
      .then((status) => {
        const { isAdmin } = this.userStore;
        if (!status || !isAdmin) {
          this.props.store.routing.push("/");
        }
      })
      .catch((error) => {
        console.error(error);
        this.props.store.routing.push("/");
      });
  }

  render() {
    const currentDate = moment().format("YYYY-MM-DD");

    return (
      <div className="App">
        <Title content="Printing" />

        {
          <Container>
            <Row>
              <Col>
                <a
                  className="btn btn-main active mb-5"
                  href={`${BASE_URL}/api/admin/print/shipping?current_date=${currentDate}`}
                >
                  Print Shipping
                </a>
              </Col>
              <Col>
                <a
                  className="btn btn-main active"
                  href={`${BASE_URL}/api/admin/print/products?current_date=${currentDate}`}
                >
                  Print Product
                </a>
              </Col>
            </Row>
          </Container>
        }
      </div>
    );
  }
}

export default connect("store")(ManagePrinting);
