import React, {Component} from 'react';
import {
  Row,
  Col,
  Container,
} from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import ShopperTable from './manage/ShopperTable'
import CustomDropdown from '../common/CustomDropdown'
import SingleProductView from './manage/shopper/SingleProductView'
import {connect} from '../utils'

class ManageShopper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeframe: null,
      location: null,
      isProductView: false,
      selectedProduct: {}
    }

    this.userStore = this.props.store.user
    this.adminStore = this.props.store.admin
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
          this.props.store.routing.push('/')
        } else {
          this.loadTimeFramesData()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadTimeFramesData() {
    this.adminStore.getTimeFrames()
  }

  loadShopLocations = (timeframe) => {
    this.adminStore.getShopLocations(timeframe)
    this.setState({timeframe})
  }

  loadShopItems = (location) => {
    const {timeframe} = this.state
    this.adminStore.getShopItems(timeframe, location)
    this.adminStore.getShopItemsFarms(timeframe, location)
    this.setState({location})
  }

  toggleSingleProductView = (product) => {
    this.setState({isProductView: !this.state.isProductView, selectedProduct: product})
    if (!product) {
      const {timeframe, location} = this.state
      this.adminStore.getShopItems(timeframe, location)
      this.adminStore.getShopItemsFarms(timeframe, location)
    }
  }

  render() {
    if (!this.userStore.user) return null

    const {timeframes, locations} = this.adminStore
    const {timeframe, isProductView, selectedProduct} = this.state
    return (
      <div className="App">
        <ManageTabs page="shopper"/>
        <Title content="Shopper Portal"/>

        <section className="page-section pt-1">
          <Container>
            <Row>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Time Frame:</div>
                  <CustomDropdown
                    values={[{id: 'all', title: 'All Timeframes'}, ...timeframes.map(item => {
                      return {id: item, title: item}
                    })]}
                    onItemClick={this.loadShopLocations}
                  />
                </div>
              </Col>
              <Col md="6" sm="12">
                <div className="mb-3">
                  <div className="mb-2 font-weight-bold">Location:</div>
                  <CustomDropdown
                    values={[{id: 'all', title: 'All Locations'}, ...locations.map(item => {
                      return {id: item, title: item}
                    })]}
                    onItemClick={this.loadShopItems}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <section className="page-section pt-1">
          <Container>
            <h2>Shop Location View</h2>
            <ShopperTable {...{timeframe}} toggleSingleProductView={this.toggleSingleProductView}/>
          </Container>
        </section>
        <SingleProductView
          isOpen={isProductView}
          toggle={this.toggleSingleProductView}
          product={selectedProduct}
        />
      </div>
    );
  }
}

export default connect("store")(ManageShopper);
