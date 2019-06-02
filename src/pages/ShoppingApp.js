import React, { Component } from "react"
import { Row, Col, Container } from "reactstrap"
import Title from "../common/page/Title"
import ManageTabs from "./manage/ManageTabs"
import ShopperTable from "./manage/ShopperTable"
import CustomDropdown from "../common/CustomDropdown"

import { connect } from "../utils"
import moment from 'moment'

class ShoppingApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeframe: null,
      locations: [],
      isProductView: false,
      selectedProduct: {},
      selectedIndex: null
    }

    // this.userStore = this.props.store.user
		this.adminStore = this.props.store.admin;
	}

	componentDidMount = () => {
		this.loadShopLocations();
	}
	
  loadShopLocations = async() => {
		const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`
		this.adminStore.getShopLocations(timeframe)
    this.setState({timeframe})
  }

  render() {
		const { locations } = this.adminStore
    return (
      <div className="App">
        <ManageTabs page="shopper" />
        <Title content="Step 1" />
        <section className="page-section pt-1">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Location:</div>
                  <CustomDropdown
                    values={[
                      { id: "all", title: "All Locations" },
                      ...locations.map(item => {
                        return { id: item, title: item };
                      })
                    ]}
                    onItemClick={this.loadShopItems}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ShoppingApp);
