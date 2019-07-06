import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, Container } from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import ShoppingAppTable from './manage/ShoppingAppTable'
import CustomDropdown from '../common/CustomDropdown'
import { Button } from 'reactstrap';
import { connect } from '../utils'
import moment from 'moment'

class ShoppingAppStep2 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeframe: null,
			locations: [],
			location: null,
      isProductView: false,
      selectedProduct: {},
			selectedIndex: null
    }

    this.userStore = props.store.user
		this.adminStore = this.props.store.admin
	}

	componentDidMount = () => {
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
    const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`;
    this.adminStore.getShopLocations(timeframe)
    this.setState({timeframe})
	}
	
  loadUnavailableShopItems = (location) => {
		// note that if shop is not selected, location param sent will be null
    this.setState({location})
    const {timeframe} = this.state
		this.adminStore.getUnavailableShopItems(this.userStore.getHeaderAuth(), timeframe, location)
  }

  render() {
		const {locations} = this.adminStore
		const {timeframe, location} = this.state
    return (
      <div className="App">
        <ManageTabs page="shopper" />
        <Title content="Shopping App" />
        <section className="page-section pt-1">
          <Container>
            <Row>
							<Col md="4" sm="6">
								<h2>Step 2</h2>
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
                    onItemClick={this.loadUnavailableShopItems}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>
				<section className="page-section pt-1">
          <Container>
            <ShoppingAppTable 
              location={location} 
              step="2" 
            />
          </Container>
        </section>
        <section className="page-section pt-1">
          <Container className="btns-space-btw">
						<Link to="/manage/shopping-app-1">
							<Button>Step 1</Button>
						</Link>
						<Link to="/manage/shopping-app-3">
							<Button>Step 3</Button>
						</Link>
          </Container>
        </section>
      </div>
    );
  }
}

export default connect("store")(ShoppingAppStep2);
