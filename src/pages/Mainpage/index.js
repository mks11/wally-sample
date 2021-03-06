import React, { Component, lazy, Suspense, useEffect } from 'react';

// Services & utilities
import { logPageView } from 'services/google-analytics';
import { connect } from 'utils';

// Config
import { APP_URL } from 'config';

// npm components
import { Box, Container, Typography, Button } from '@material-ui/core';

// Custom Components
import AddonFirstModal from 'common/AddonFirstModal';
import CategoryCard from './CategoryCard';
import CategoriesList from './CategoriesList';
import Filters from './ProductTop/Filters';
import Hero from './Hero';
import Product from './Product';
import ProductList from './ProductList';

// import ProductWithPackaging from '../ProductWithPackaging';
import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';
import { useStores } from 'hooks/mobx';

// Cookies
import { useCookies } from 'react-cookie';

const ProductModal = lazy(() => import('modals/ProductModalV2'));

class Mainpage extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.uiStore = this.props.store.ui;
    this.routing = this.props.store.routing;
    this.modalStore = this.props.store.modal;
    this.modalV2 = this.props.store.modalV2;
    this.productStore = this.props.store.product;
    this.checkoutStore = this.props.store.checkout;
    this.zipStore = this.props.store.zip;
    this.packagingUnitStore = this.props.store.packagingUnit;

    this.state = {
      deliveryTimes: this.checkoutStore.deliveryTimes,
      sidebar: [],
      categoryTypeMode: 'limit',
      sortType: 'times_bought',
    };

    this.id = this.props.match.params.id;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    const { match } = this.props;
    logPageView(location.pathname);
    this.userStore.getStatus(true).then((status) => {
      if (match && match.path === '/schedule-pickup') {
        this.modalV2.open(<SchedulePickupForm />);
      }

      if (window.location.pathname.split('/')[1] === 'packaging') {
        if (
          [
            '5e0e488c3f26046cc60195f6',
            '5e0e488c3f26046cc60195f4',
            '5e0e488c3f26046cc60195f3',
            '5e0e488c3f26046cc60195f2',
          ].includes(this.props.match.params.id)
        ) {
          window.location.href = `https://the-wally-shop-app.s3.us-east-2.amazonaws.com/ambassador-pdf/${this.props.match.params.id}.pdf`;
        } else {
          this.packagingUnitStore
            .getPackagingUnit(this.props.match.params.id)
            .then((unit) => {
              if (unit.packaging_type_id === '5e0e45220ec2446bcfeed983') {
                window.location.href = `https://the-wally-shop-app.s3.us-east-2.amazonaws.com/ambassador-pdf/welcome-letter.pdf?qr_ref=${this.props.match.params.id}`;
              } else {
                if (unit.product_id) {
                  this.handleProductModal(unit.product_id);
                } else {
                  this.routing.push(`/?qr_ref=${this.props.match.params.id}`);
                }
              }
            })
            .catch((e) =>
              console.error('Failed to load product displayed: ', e),
            );
        }
      } else {
        if (!status) {
          this.routing.push('/');
        } else {
          // this.checkoutStore.getDeliveryTimes();
          this.loadData();
          const { mainFirst, mainSecond } = this.userStore.flags || {};
          !mainFirst && this.modalStore.toggleModal('mainFirst');
          mainFirst && !mainSecond && this.modalStore.toggleModal('mainSecond');
        }
      }
    });
  }

  loadData() {
    const id = this.props.match.params.id;
    this.id = id;

    if (this.id === 'buyagain') {
      this.productStore
        .getHistoricalProducts(this.userStore.getHeaderAuth())
        .catch((e) => console.error('Failed to load historical products: ', e));
    } else {
      let categoryTypeMode = 'all';

      this.setState({ categoryTypeMode });

      const deliveryData = this.userStore.getDeliveryParams();

      this.productStore.getAdvertisements();
      // this.productStore.getCategories();
      this.productStore
        .getProductDisplayed(id, deliveryData, this.userStore.getHeaderAuth())
        .then((data) => {
          this.userStore.adjustDeliveryTimes(
            data.delivery_date,
            this.state.deliveryTimes,
          );
          this.setState({ sidebar: this.productStore.sidebar });
        })
        .catch((e) => console.error('Failed to load product displayed: ', e));
    }
  }

  componentDidUpdate() {
    const id = this.props.match.params.id;
    if (this.id !== id) {
      this.loadData();
    }
  }

  handleProductModal = async (product_id) => {
    try {
      await this.productStore.showModal(product_id, null);
      this.modalV2.open(
        <Suspense
          fallback={<Typography variant="h1">Loading product...</Typography>}
        >
          <ProductModal />
        </Suspense>,
        'right',
        'md',
      );
    } catch (error) {
      console.error(error);
    }
  };

  handleSort = (type) => {
    this.setState({ sortType: type });
  };

  sortByType = (a, b) => {
    switch (this.state.sortType) {
      case 'times_bought':
        return b.times_bought - a.times_bought;
      case 'last_ordered':
        return Date(a.last_ordered) <= Date(b.last_ordered);
      case 'by_name':
        return a.product_name.localeCompare(b.product_name);
      default:
        return 0;
    }
  };

  render() {
    const { sidebar } = this.state;

    const id = this.props.match.params.id;
    const ads1 = this.productStore.ads1 ? this.productStore.ads1 : null;
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 : null;

    return (
      <div className="App">
        <div className="product-content">
          <Container maxWidth="xl">
            <div className="row ">
              {/* Featured Brands */}
              <div className="col-xl-3 col-lg-3 d-xl-block d-lg-block d-md-none d-sm-none d-none">
                <div className="product-content-left">
                  <div className="product-content-left-scroll">
                    <div className="mb-4">
                      <Filters />
                    </div>
                    <CategoriesList selectedId={id} list={sidebar} />
                    <br />
                    <div>
                      {ads1 && <img src={APP_URL + ads1.image} alt="" />}
                    </div>
                    <br />
                  </div>
                </div>
              </div>

              {id === 'buyagain' ? (
                <div className="col-xl-9 col-lg-9 col-md-12">
                  <div className="product-content-right">
                    <div className="product-breadcrumb">
                      <h2>Buy Again</h2>
                      <div className="filters">
                        <div className="filters-title">Sort:</div>
                        <div className="filters-values as-sort">
                          <ul>
                            <li
                              className={
                                this.state.sortType === 'times_bought'
                                  ? 'active'
                                  : ''
                              }
                              onClick={() => this.handleSort('times_bought')}
                            >
                              Most Bought
                            </li>
                            <li
                              className={
                                this.state.sortType === 'last_ordered'
                                  ? 'active'
                                  : ''
                              }
                              onClick={() => this.handleSort('last_ordered')}
                            >
                              Recently Ordered
                            </li>
                            <li
                              className={
                                this.state.sortType === 'by_name'
                                  ? 'active'
                                  : ''
                              }
                              onClick={() => this.handleSort('by_name')}
                            >
                              A-Z
                            </li>
                          </ul>
                        </div>
                      </div>
                      <hr />
                    </div>

                    <div className="row">
                      {this.productStore.historical_products.length ? (
                        this.productStore.historical_products
                          .sort((a, b) => this.sortByType(a, b))
                          .map((product, index) => (
                            <Product
                              key={index}
                              product={product}
                              deliveryTimes={this.state.deliveryTimes}
                            />
                          ))
                      ) : (
                        <h2>No Orders Yet</h2>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-xl-9 col-lg-9 col-md-12">
                  <div className="product-content-right">
                    {/* {this.props.location.pathname.split('/')[1] ===
                    'packaging-blank' ? (
                      <ProductWithPackaging
                        packagingId={this.props.match.params.id}
                      />
                    ) : ( */}
                    <>
                      <Hero />
                      {ads2 && (
                        <img
                          src={APP_URL + ads2.image}
                          className="img-fluid"
                          alt=""
                        />
                      )}

                      {this.state.categoryTypeMode === 'limit' ? (
                        <div className="row">
                          {this.productStore.main_display.map(
                            (category, index) => (
                              <CategoryCard key={index} category={category} />
                            ),
                          )}
                        </div>
                      ) : (
                        this.productStore.main_display.map(
                          (category, index) => (
                            <ProductList
                              key={index}
                              display={category}
                              mode={this.state.categoryTypeMode}
                              deliveryTimes={this.state.deliveryTimes}
                            />
                          ),
                        )
                      )}
                    </>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
        <ClosingNotification />
        <AddonFirstModal />
      </div>
    );
  }
}

function ClosingNotification() {
  const { dialog: dialogStore } = useStores();

  const [cookies, setCookies] = useCookies(['readClosingNotification']);

  const handleRead = () => {
    setCookies('readClosingNotification', 'read');
    dialogStore.close();
  };

  useEffect(() => {
    if (cookies['readClosingNotification']) {
      return;
    }
    dialogStore.open(
      <>
        <Typography>Message </Typography>
        <Button onClick={handleRead}> OK </Button>
      </>,
      'sm',
    );
  }, []);

  return <Box />;
}

export default connect('store')(Mainpage);
