import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Services & utilities
import { logPageView, logEvent } from 'services/google-analytics';
import { connect, datesEqual } from 'utils';

// Config
import { APP_URL } from 'config';

// npm components
import { Box, Container, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Image } from 'pure-react-carousel';

// Custom Components
import AddonFirstModal from 'common/AddonFirstModal';
import CarbonBar from 'common/CarbonBar';
import Product from './Product';
import ProductList from './ProductList';
import ProductTop from './ProductTop';
import MobileSearch from './MobileSearch';
import CategoryCard from './CategoryCard';
import CategoriesList from './CategoriesList';
import ProductWithPackaging from '../ProductWithPackaging';
import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';
import LoginForm from 'forms/authentication/LoginForm';
import ImageCarousel from 'common/ImageCarousel';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

var heroImages = [
  {
    lg:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-1200.jpg',
    md:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-768.jpg',
    sm:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-480.jpg',
  },
  {
    lg:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-1200.jpg',
    md:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-768.jpg',
    sm:
      'https://the-wally-shop-app.s3.us-east-2.amazonaws.com/featured-brand-hero-images/wild-lather/wild-lather-480.jpg',
  },
];
const hasDots = heroImages.length > 1;

var DesktopCarouselWrapper = styled(Box)`
  @media only screen and (max-width: 567px) {
    display: none;
  }
`;

var MobileCarouselWrapper = styled(Box)`
  @media only screen and (min-width: 568px) {
    display: none;
  }
`;

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
      showMobileSearch: false,
      filters: [],
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
          this.userStore.giftCardPromo && this.processGiftCardPromo(status);
          this.checkoutStore.getDeliveryTimes();
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

      this.checkoutStore
        .getCurrentCart(this.userStore.getHeaderAuth(), deliveryData)
        .then((data) => {
          if (
            !datesEqual(data.delivery_date, deliveryData.date) &&
            deliveryData.date !== null
          ) {
            this.checkoutStore.getDeliveryTimes().then(() => {
              if (
                !this.userStore.status ||
                (this.userStore.status && !this.userStore.user.is_ecomm)
              ) {
                this.modalStore.toggleDelivery();
              }
            });
          }

          data &&
            this.userStore.adjustDeliveryTimes(
              data.delivery_date,
              this.state.deliveryTimes,
            );

          if (this.userStore.cameFromCartUrl) {
            if (
              !this.userStore.status ||
              (this.userStore.status && !this.userStore.user.is_ecomm)
            ) {
              const delivery = this.userStore.getDeliveryParams();
              if (delivery.zip && delivery.date) {
                this.checkoutStore.updateCartItems(delivery);
                this.userStore.cameFromCartUrl = false;
              } else {
                if (
                  !this.userStore.status ||
                  (this.userStore.status && !this.userStore.user.is_ecomm)
                ) {
                  this.modalStore.toggleDelivery();
                }
              }
            }
          }
        })
        .catch((e) => {
          console.error('Failed to load current cart', e);
        });
    }
  }

  processGiftCardPromo(userStatus) {
    if (userStatus) {
      this.checkoutStore
        .checkPromo(
          { promoCode: this.userStore.giftCardPromo },
          this.userStore.getHeaderAuth(),
        )
        .then((data) => {
          let msg = '';
          if (data.valid) {
            msg = 'Store Credit Redeemed';
            this.userStore.getUser().then(() => {
              this.loadData();
            });
          } else {
            msg = 'Invalid Promo-code';
          }
          this.modalStore.toggleModal('referralresult', msg);
          this.userStore.giftCardPromo = null;
        })
        .catch((e) => {
          const msg = !e.response.data.error
            ? 'Check Promo failed'
            : e.response.data.error.message;
          this.modalStore.toggleModal('referralresult', msg);
          this.userStore.giftCardPromo = null;
        });
    } else {
      this.modalV2.open(<LoginForm />);
    }
  }

  componentDidUpdate() {
    const id = this.props.match.params.id;
    if (this.id !== id) {
      this.loadData();
    }
  }

  handleProductModal = (product_id) => {
    this.productStore.showModal(product_id, null).then((data) => {
      this.modalStore.toggleModal('product');
    });
  };

  handleSearch = (keyword) => {
    this.uiStore.hideBackdrop();

    if (!keyword.length) {
      this.productStore.resetSearch();
      return;
    }
    logEvent({ category: 'Search', action: 'SearchKeyword', label: keyword });
    this.productStore.searchKeyword(
      keyword,
      this.userStore.getDeliveryParams(),
      this.userStore.getHeaderAuth(),
    );
  };

  handleMobileSearchClose = () => {
    this.setState({ showMobileSearch: false });
  };

  handleMobileSearchOpen = () => {
    this.setState({ showMobileSearch: true });
  };

  handleMobileSearch = (e) => {
    if (e.keyCode === 13) {
      this.setState({ showMobileSearch: false });
      this.handleSearch(e.target.value);
    }
  };

  handleCategoryClick = () => {
    this.setState({ showMobileSearch: false });
    this.productStore.resetSearch();
  };

  handleFilterUpdate = (filters) => {
    this.setState({ filters });
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
    const { showMobileSearch, sidebar, filters } = this.state;

    const id = this.props.match.params.id;
    const cartItems = this.checkoutStore.cart
      ? this.checkoutStore.cart.cart_items
      : [];
    var count = 0;
    for (var i = cartItems.length - 1; i >= 0; i--) {
      count += cartItems[i].customer_quantity;
    }
    const ads1 = this.productStore.ads1 ? this.productStore.ads1 : null;
    const ads2 = this.productStore.ads2 ? this.productStore.ads2 : null;

    // Featured Brands
    const slides = heroImages.map((img) => (
      <HeroSlide
        alt={'New Wild Lather Products'}
        body={'Lather up & breathe deeply.'}
        img={img}
        justify="flex-start"
        title={'Soaps by Wild Lather'}
        url="/shop/brands/wild-lather"
      />
    ));

    return (
      <div className="App">
        <ProductTop
          onMobileSearchClick={this.handleMobileSearchOpen}
          onSearch={this.handleSearch}
          onCategoryClick={this.handleCategoryClick}
          onFilterUpdate={this.handleFilterUpdate}
        />

        <div className="product-content">
          <div className="container">
            <div className="row ">
              <div className="col-xl-2 col-md-3 col-sm-4">
                <div className="product-content-left">
                  <div className="product-content-left-scroll">
                    <div className="mb-4">
                      <img src="/images/sidepanel_sticker.png" />
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

              {id === 'buyagain' && !this.productStore.search.state ? (
                <div className="col-xl-10 col-md-9 col-sm-12">
                  <div className="product-content-right">
                    <div className="product-breadcrumb">
                      <h2>Buy Again</h2>
                      <div className="filters">
                        <div className="filters-title">Sort:</div>
                        <div className="filters-values as-sort">
                          <ul>
                            <li
                              className={
                                this.state.sortType === 'times_bought' &&
                                'active'
                              }
                              onClick={() => this.handleSort('times_bought')}
                            >
                              Most Bought
                            </li>
                            <li
                              className={
                                this.state.sortType === 'last_ordered' &&
                                'active'
                              }
                              onClick={() => this.handleSort('last_ordered')}
                            >
                              Recently Ordered
                            </li>
                            <li
                              className={
                                this.state.sortType === 'by_name' && 'active'
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
                              onProductClick={this.handleProductModal}
                            />
                          ))
                      ) : (
                        <h2>No Orders Yet</h2>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {this.productStore.search.state ? (
                <div className="col-xl-10 col-md-9 col-sm-12">
                  <div className="product-content-right">
                    {ads2 && (
                      <img src={APP_URL + ads2} className="img-fluid" alt="" />
                    )}

                    <div className="product-breadcrumb">
                      <CarbonBar nCartItems={count} />
                      <hr />
                    </div>

                    <div className="row">
                      {this.productStore.search.display
                        .filter((p) =>
                          filters.length
                            ? !filters.some((f) => {
                                if (p.allergens && p.tags) {
                                  let [t, v] = f.split(',');
                                  if (t === 'allergen')
                                    return p.allergens.includes(v);
                                  if (t === 'tag') return !p.tags.includes(v);
                                }
                                return true;
                              })
                            : true,
                        )
                        .map((product, index) => (
                          <Product
                            key={index}
                            product={product}
                            deliveryTimes={this.state.deliveryTimes}
                            onProductClick={this.handleProductModal}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                id !== 'buyagain' && (
                  <div className="col-xl-10 col-md-9 col-sm-12">
                    <div className="product-content-right">
                      {this.props.location.pathname.split('/')[1] ===
                      'packaging-blank' ? (
                        <ProductWithPackaging
                          packagingId={this.props.match.params.id}
                        />
                      ) : (
                        <React.Fragment>
                          {ads2 && (
                            <img
                              src={APP_URL + ads2.image}
                              className="img-fluid"
                              alt=""
                            />
                          )}

                          <div className="product-breadcrumb">
                            <CarbonBar nCartItems={count} />
                          </div>

                          {/* Featured Brands */}
                          <Container maxWidth="lg" disableGutters>
                            {/* displayed from 568px and up */}
                            <DesktopCarouselWrapper my={2} zIndex={1}>
                              <ImageCarousel
                                dots={hasDots}
                                keyName={'featured-brands'}
                                height={675}
                                slides={slides}
                                width={1200}
                              />
                            </DesktopCarouselWrapper>
                            {/* displayed from 567px and down */}
                            <MobileCarouselWrapper my={2} zIndex={1}>
                              <ImageCarousel
                                dots={hasDots}
                                keyName={'featured-brands'}
                                height={480}
                                slides={slides}
                                width={480}
                              />
                            </MobileCarouselWrapper>
                          </Container>

                          {this.state.categoryTypeMode === 'limit' ? (
                            <div className="row">
                              {this.productStore.main_display.map(
                                (category, index) => (
                                  <CategoryCard
                                    key={index}
                                    category={category}
                                  />
                                ),
                              )}
                            </div>
                          ) : (
                            this.productStore.main_display.map(
                              (category, index) => (
                                <ProductList
                                  key={index}
                                  display={category}
                                  filters={filters}
                                  mode={this.state.categoryTypeMode}
                                  deliveryTimes={this.state.deliveryTimes}
                                  onProductClick={this.handleProductModal}
                                />
                              ),
                            )
                          )}
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <MobileSearch
          show={showMobileSearch}
          onClose={this.handleMobileSearchClose}
          onSearch={this.handleMobileSearch}
          onCategoryClick={this.handleCategoryClick}
          sidebar={sidebar}
          id={id}
          onFilterUpdate={this.handleFilterUpdate}
        />

        <AddonFirstModal />
      </div>
    );
  }
}

export default connect('store')(Mainpage);

const LargeHeroImage = styled(Image)`
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const MediumHeroImage = styled(Image)`
  @media only screen and (min-width: 568px) and (max-width: 768px) {
    display: block;
  }

  display: none;
`;

const SmallHeroImage = styled(Image)`
  @media only screen and (min-width: 568px) {
    display: none;
  }
`;

function HeroSlide({ alt, body, img, justify, title, url }) {
  return (
    <Box position="relative">
      <LargeHeroImage src={img.lg} alt={alt} />
      <MediumHeroImage src={img.md} alt={alt} />
      <SmallHeroImage src={img.sm} alt={alt} />
      <HeroSlideOverlay body={body} justify={justify} title={title} url={url} />
    </Box>
  );
}

HeroSlide.propTypes = {
  alt: PropTypes.string,
  body: PropTypes.string,
  img: PropTypes.object.isRequired,
  justify: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
};

const SlideOverlayWrapper = styled(Box)`
  @media only screen and (min-width: 992px) {
    padding: 4.5rem;
  }

  padding: 2rem;
`;

function HeroSlideOverlay({ body, justify, title, url }) {
  return (
    <SlideOverlayWrapper
      position="absolute"
      top="0"
      left="0"
      width="100%"
      maxHeight="100%"
      overflow="hidden"
    >
      <Grid container justify={justify || 'flex-start'}>
        <Grid item xs={12} md={8} lg={8}>
          {title && <Typography variant="h1">{title}</Typography>}
          {body && <Typography gutterBottom>{body}</Typography>}
          {url && (
            <PrimaryWallyButton component={Link} to={url} alt={title}>
              <Typography component="span">Shop Now</Typography>
            </PrimaryWallyButton>
          )}
        </Grid>
      </Grid>
    </SlideOverlayWrapper>
  );
}

HeroSlideOverlay.propTypes = {
  body: PropTypes.string,
  justify: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
};
