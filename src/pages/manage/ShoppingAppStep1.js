import React, { Component } from 'react'
import { connect } from '../../utils'
import { Link } from 'react-router-dom'
import { Row, Col, Container } from 'reactstrap'
import Title from '../../common/page/Title'
import ManageTabs from './ManageTabs'
import ShoppingAppTable from './ShoppingAppTable'
import CurrentStatusTable from './shopper/CurrentStatusTable'
import CustomDropdown from '../../common/CustomDropdown'
import ModalRequiredPackaging from './shopper/ModalRequiredPackaging'
import { Button } from 'reactstrap'
import moment from 'moment'

class ShoppingAppStep1 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeframe: null,
			locations: [],
			location: null,
      isProductView: false,
      selectedProduct: {},
      selectedIndex: null,
    }

    this.userStore = props.store.user
    this.adminStore = props.store.admin
    this.modalStore = props.store.modal
	}
  
  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (
          status &&
          (user.type === 'admin' ||
          user.type === 'super-admin' ||
          user.type === 'tws-ops')
        ) {
          this.loadShopLocations()
        } else {
          this.props.store.routing.push('/')
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }
  
  componentWillUnmount = () => {
    this.adminStore.clearStoreShopItems()
    this.adminStore.clearStoreLocations()
  }
	
  loadShopLocations = () => {
    const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`
    this.adminStore.getShopLocations(timeframe)
    this.setState({timeframe})
	}
	
  loadShopItems = (location) => {
    // note that if shop is not selected, location param sent will be null
    const {timeframe} = this.state
    this.adminStore.getShopItems(timeframe, location)
    this.adminStore.getShopperPackagingInfo(timeframe, location)
    this.setState({location})
  }

  render() {
    const {locations} = this.adminStore
    const {togglePackaging} = this.modalStore
    const {timeframe, location} = this.state
    return (
      <div className="App">
        <ManageTabs page="shopper" />
        <Title content="Shopping App" />
        <section className="page-section pt-1 pb-1">
          <Container>
            <Row>
							<Col md="4" sm="6">
								<h2>Step 1</h2>
							</Col>
							<Col md="4" sm="6">
								<h2>2:00 - 2:15 PM</h2>
							</Col>
              <Col md="4" sm="12">
                <div className="mb-3">
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
				<section className="page-section pt-1 pb-3">
          <Container className="btn-center">
            <Button color="link" onClick={togglePackaging}>Packaging Info</Button>
            <ModalRequiredPackaging
              timeframe={timeframe}
              location={location}
            />
          </Container>
				</section>
				<section className="page-section pt-1">
          <Container>
            <ShoppingAppTable
              location={location}
              step="1"
            />
          </Container>
        </section>
        <section className="page-section pt-1">
          <Container>
            <h4>Current Status</h4>
            <CurrentStatusTable />
          </Container>
        </section>
        <section className="page-section pt-1">
          <Container className="btn-center">
          <Link to="/manage/shopping-app-2">
            <Button>Step 2</Button>
          </Link>
          </Container>
        </section>
      </div>
    )
  }
}

export default connect("store")(ShoppingAppStep1);
