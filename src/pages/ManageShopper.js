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
import {toJS} from 'mobx';

class ManageShopper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeframe: null,
      location: null,
      isProductView: true,
      selectedProduct: {},
      selectedIndex: null
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

  toggleSingleProductView = (product, index) => {
    this.setState({isProductView: !this.state.isProductView, selectedProduct: product, selectedIndex: index})
    if (!product) {
      const {timeframe, location} = this.state
      this.adminStore.getShopItems(timeframe, location)
      this.adminStore.getShopItemsFarms(timeframe, location)
      this.adminStore.getShopLocations(timeframe)
    }
  }

  prevProductExists = () => {
    let {shopitems} = this.adminStore
    shopitems = toJS(shopitems)
    const {selectedIndex} = this.state
    return typeof shopitems[selectedIndex - 1] !== 'undefined'
  }

  nextProductExists = () => {
    let {shopitems} = this.adminStore
    shopitems = toJS(shopitems)
    const {selectedIndex} = this.state
    return typeof shopitems[selectedIndex + 1] !== 'undefined'
  }

  handlePrevProductClick = (e) => {
    e.preventDefault()
    let {shopitems} = this.adminStore
    shopitems = toJS(shopitems)
    const {selectedIndex} = this.state
    this.setState({selectedProduct: shopitems[selectedIndex - 1], selectedIndex: selectedIndex - 1})
  }

  handleNextProductClick = (e) => {
    e.preventDefault()
    let {shopitems} = this.adminStore
    shopitems = toJS(shopitems)
    const {selectedIndex} = this.state
    this.setState({selectedProduct: shopitems[selectedIndex + 1], selectedIndex: selectedIndex + 1})
  }

  render() {
    if (!this.userStore.user) return null
    const {
      shopitems,
      shopitemsFarms,
    } = this.adminStore
    const {timeframes, locations} = this.adminStore
    const {timeframe, isProductView, selectedProduct, selectedIndex} = this.state
    return (
      <div className="App">
        <ManageTabs page="shopper"/>
        <Title content="Shopper Portal"/>
        {!isProductView ?
          <React.Fragment>
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
                <ShopperTable {...{timeframe}} shopitems={shopitems}
                              toggleSingleProductView={this.toggleSingleProductView}/>
              </Container>
            </section>
          </React.Fragment>
          :
          <SingleProductView
            toggle={() => this.toggleSingleProductView()}
            product={selectedProduct}
            onPrevProduct={this.handlePrevProductClick}
            onNextProduct={this.handleNextProductClick}
            shopitemsFarms={shopitemsFarms}
            selectedIndex={selectedIndex}
            prevDisabled={!this.prevProductExists()}
            nextDisabled={!this.nextProductExists()}
            timeframe={timeframe}
          />
        }
      </div>
    );
  }
}

export default connect("store")(ManageShopper);
