import React, { Component } from 'react'
import { connect } from '../utils'
import { Link } from 'react-router-dom'
import { Row, Col, Container } from 'reactstrap'
import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import ShoppingAppTable from './manage/ShoppingAppTable'
import CurrentStatusTable from './manage/shopper/CurrentStatusTable'
import CustomDropdown from '../common/CustomDropdown'
import ModalRequiredPackaging from './manage/shopper/ModalRequiredPackaging'
import { Button } from 'reactstrap'
import moment from 'moment'

class ShoppingAppStep1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeframe: `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`,
			locations: [],
			location: null,
      isProductView: false,
      selectedProduct: {},
      selectedIndex: null,
      showModal: false
    }
		this.adminStore = this.props.store.admin
	}

	componentDidMount = () => {
		this.loadShopLocations()
	}
	
  loadShopLocations = () => {
    const {timeframe} = this.state
    this.adminStore.getShopLocations(timeframe)
	}
	
  loadShopItems = (location) => {
    // note that if shop is not selected, location param sent will be null
    const {timeframe} = this.state
		this.adminStore.getShopItems(timeframe, location)
    this.setState({location})
  }

  toggleModal = async() => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }))
  }

  render() {
		const {locations} = this.adminStore
    const {timeframe, location, showModal} = this.state
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
            <Button color="link" onClick={this.toggleModal}>Packaging Info</Button>
            <ModalRequiredPackaging
              toggleModal={this.toggleModal}
              showModal={showModal}
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
