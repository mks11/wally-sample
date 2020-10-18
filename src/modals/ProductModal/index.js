// Node Modules
import React, { useState, Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Services and Utilities
import { logModalView, logEvent } from 'services/google-analytics';
import { formatMoney, connect } from 'utils';

// Components
import { Box, Grid, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { Row, Col } from 'reactstrap';
import QuantitySelect from '../../common/QuantitySelect';
import Product from '../../pages/Mainpage/Product/index';
import ProductRatingForm from '../../common/ProductRatingForm';
import ProductRatingStars from '../../common/ProductRatingStars';
import { Image, ImageWithZoom } from 'pure-react-carousel';
import ImageCarousel from 'common/ImageCarousel';

import { PRODUCT_BASE_URL } from 'config';

const SimilarProducts = styled(Row)`
  flex-wrap: nowrap;
  overflow-x: auto;
`;

class ProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: 1,
      infoPackage: false,
      // slick: false,
      packagingAddon: '',
      quantityAddon: 0,
      outOfStock: false,
      available: true,
      packagingType: null,
      priceMultiplier: 1,
    };

    this.productStore = props.store.product;
    this.modalStore = props.store.modal;
    this.userStore = props.store.user;
  }

  componentDidMount() {
    const product = this.productStore;
    const modal = this.modalStore;
    const user = this.userStore;

    this.setState({ qty: product.activeProduct.min_size });
    let priceMultiplier = 1;
    this.setState({ priceMultiplier: priceMultiplier });

    let packagingType =
      product.activeProduct.available_inventory[0].packaging_type;
    this.setState({ packagingType: packagingType });

    if (!product.activeProduct) return null;

    this.setState({
      outOfStock: product.activeProduct.out_of_stock,
      available: true,
    });
    logModalView('/product/' + product.activeProductId);

    if (product.activeProduct.add_ons && product.activeProduct.add_ons.length) {
      const { addonsFirst } = user.flags || {};
      !addonsFirst && modal.toggleAddonsFirst();
    }
  }

  toggleInfoPackage = () => {
    this.setState({ infoPackage: !this.state.infoPackage });
  };

  handleAddToCart = () => {
    const { product, checkout, user, routing } = this.props.stores;
    const {
      custom,
      customIsEmpty,
      quantityAddon,
      packagingAddon,
      outOfStock,
      available,
    } = this.state;

    if (outOfStock || !available) return;

    if (custom && customIsEmpty) {
      this.setState({
        customError: true,
      });
      return;
    }

    logEvent({
      category: 'Product',
      action: 'AddToCart',
      value: this.state.qty,
      label: product.activeProductId,
    });
    const activeProduct = product.activeProduct;
    const inventory = activeProduct.available_inventory[0]
      ? activeProduct.available_inventory[0]
      : null;
    const order_summary = routing.location.pathname.indexOf('checkout') !== -1;

    const finalUnitType = activeProduct.unit_type;

    const items = [
      {
        quantity: this.state.qty,
        product_id: inventory.product_id,
        inventory_id: inventory._id,
        unit_type: finalUnitType,
      },
    ];

    if (quantityAddon > 0) {
      const addonProduct = activeProduct.add_ons.find(
        (p) => p.product_id === packagingAddon,
      );

      items.push({
        quantity: quantityAddon,
        product_id: packagingAddon,
        inventory_id: addonProduct.inventory[0]._id,
        unit_type: addonProduct.unit_type,
      });
    }

    checkout
      .editCurrentCart(
        { items },
        user.getHeaderAuth(),
        order_summary,
        user.getDeliveryParams(),
      )
      .then((data) => {
        data &&
          user.adjustDeliveryTimes(
            data.delivery_date,
            this.state.deliveryTimes,
          );
      })
      .catch((e) => {
        if (e.response) {
          const msg = e.response.data.error.message;
          this.setState({ invalidText: msg });
          console.error('Failed to add to cart', e);
        }
      });

    this.props.toggle();
  };

  handleSelectQuantity = (e) => {
    this.setState({ qty: e.target.value });
  };

  handlePackagingAddon = (value) => {
    this.setState({ packagingAddon: value });
  };

  handleQuantityAddon = (value) => {
    this.setState({ quantityAddon: value });
  };

  handlePackagingChange = (value) => {
    const { product } = this.props.stores;
    this.setState({ packagingType: value.type });
    let idx = product.activeProduct.packaging_id
      .map(function (i) {
        return i.toString();
      })
      .indexOf(value._id);
    let vol = product.activeProduct.packaging_vol[idx];
    this.setState({ priceMultiplier: vol });
  };

  handlePackagingCustomClick = () => {
    this.setState({ packagingType: null });
  };

  handleProductClick = (product_id) => {
    this.productStore.showModal(product_id);
    this.modalStore.toggleModal('product');
  };

  truncate = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.slice(0, length) + '...';
  };

  closeModal = () => {
    this.props.toggle();
  };

  render() {
    const { activeProduct, activeProductComments } = this.productStore;
    if (!activeProduct) return null;
    let recentThreeComments = [];
    if (activeProductComments)
      recentThreeComments = activeProductComments
        .filter((comment) => comment.comment)
        .slice(0, 3);

    const {
      a_plus_url,
      allergens,
      available_inventory,
      avg_rating,
      buy_by_packaging,
      description,
      fbw,
      image_refs,
      nutrition_facts,
      ingredient_labels,
      ingredients,
      instruction,
      manufacturer,
      manufacturer_url_name,
      max_qty,
      name,
      netWeight,
      pricePerOz,
      packaging_vol,
      packagings,
      product_id,
      similar_products,
      std_packaging,
      subcat_name,
      tags,
      unit_type,
      vendor,
      vendorFull,
    } = activeProduct;
    let { unit_weight } = activeProduct;
    let shipMessage = `Fulfilled by The Wally Shop.`;
    if (available_inventory[0])
      shipMessage = `Sold and fulfilled by The Wally Shop`;
    if (fbw)
      shipMessage = 'Sold by ' + vendor + ', fulfilled by The Wally Shop.';

    let infoPackageClass = 'package-info';
    if (this.state.infoPackage) {
      infoPackageClass += ' open';
    }

    const inventory = available_inventory[0] ? available_inventory[0] : null;
    let qtyOptions = [];

    const incrementValue = 1;
    const minSize = 1;
    const maxQty = Math.min(max_qty, 10);

    for (var i = 0; i < maxQty; i++) {
      var opt = minSize + i * incrementValue;
      qtyOptions.push(+opt.toFixed(3));
    }

    let price = inventory.price / 100;

    let totalPrice = price * this.state.qty * this.state.priceMultiplier;

    var price_unit = '';
    if (['ea'].includes(unit_type)) {
      if (subcat_name) {
        price_unit = subcat_name;
      } else {
        price_unit = 'jar';
      }
    } else {
      price_unit += unit_type;
    }

    var weight_unit = 'lbs';
    if (unit_weight && unit_weight < 0.05) {
      weight_unit = 'oz';
      unit_weight = unit_weight * 16;
    }

    if (unit_weight) {
      unit_weight.toFixed(1);
    }

    const packaging = packagings && packagings[0] ? packagings[0] : null;
    const packaging_type = std_packaging;
    const packaging_description = packaging ? packaging.description : null;
    const packaging_size =
      inventory && inventory.packaging && inventory.packaging.size;
    const { slides, thumbnails } = createCarouselSlides(
      image_refs,
      ingredient_labels,
      name,
      nutrition_facts,
      product_id,
    );

    return (
      <div className="product-modal-wrap">
        <Typography variant="h1">{name}</Typography>
        {manufacturer && (
          <Brand
            manufacturer={manufacturer}
            vendor={vendorFull}
            onClick={this.closeModal}
          />
        )}
        <Typography variant="subtitle1" gutterBottom>
          {shipMessage}
        </Typography>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <ImageCarousel
              keyName={product_id}
              height={500}
              slides={slides}
              thumbnails={thumbnails}
              width={500}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Typography
              variant="h4"
              component="p"
              style={{ fontWeight: 'bold', color: '#6060a8' }}
            >
              {formatMoney(price)}
            </Typography>
            <Typography
              variant="subtitle1"
              component="span"
              gutterBottom
              style={{ fontWeight: 'bold' }}
            >
              {typeof netWeight === 'number'
                ? `Net weight ${netWeight} oz `
                : `${netWeight} `}
            </Typography>
            <Typography variant="subtitle1" component="span" gutterBottom>
              {typeof pricePerOz === 'number'
                ? `(${formatMoney(pricePerOz)} / oz)`
                : `(${pricePerOz})`}
            </Typography>
            {/* NOT SURE WHAT THIS DOES BUT DON'T THINK IT'S NECESSARY RIGHT NOW */}
            {/* {['ea', 'bunch', 'pint'].includes(unit_type) && unit_weight && (
              <div>
                Unit weight is {unit_weight} {weight_unit}.
              </div>
            )} */}
            <hr />

            {/* PACKAGING ICONS - NOT USED AT THE MOMENT */}
            {/* <div className={infoPackageClass}>
              <strong>Packaged in:</strong>{' '}
              <i
                onClick={this.toggleInfoPackage}
                className="fa fa-info-circle"
              ></i>
              {jarIcons}
              <div className="package-info-popover">
                <h4>{packaging_type}</h4>
                <p>{packaging_description}</p>
                <p>More sizes coming soon!</p>
              </div>
            </div> */}
            {/* NOT SURE WHAT THIS DOES BUT DON'T THINK IT'S NECESSARY RIGHT NOW */}
            {/* <div className="mb-3">{packaging_type}</div> */}
            {/* {buy_by_packaging && (
              <React.Fragment>
                <div>
                  <strong>Size:</strong>
                </div>
                <AmountGroup
                  groupped={false}
                  className="package-type-group"
                  amountClick={this.handlePackagingChange}
                  customClick={this.handlePackagingCustomClick}
                  values={packagings ? packagings : []}
                  selected={packagings ? packagings[0].type : null}
                  weights={packagings ? packaging_vol : []}
                  unit_type={unit_type}
                  custom={false}
                  product={true}
                />
              </React.Fragment>
            )} */}
            <Typography
              variant="h4"
              component="p"
              gutterBottom
              style={{ fontWeight: 'bold' }}
            >
              Quantity:
            </Typography>
            <QuantitySelect
              value={this.state.qty}
              onSelectChange={this.handleSelectQuantity}
              options={qtyOptions}
              price_unit={buy_by_packaging ? '' : price_unit}
            />
            <Typography variant="body1" gutterBottom>
              Total: {formatMoney(totalPrice)}
            </Typography>
            <button
              onClick={this.handleAddToCart}
              className={`btn btn-danger btn-add-cart mb-2 ${
                this.state.outOfStock || !this.state.available ? 'inactive' : ''
              }`}
            >
              {this.state.outOfStock
                ? 'Out of Stock'
                : this.state.available
                ? 'Add to cart'
                : 'Unavailable'}
            </button>
            <br />
            <br />
            <Typography variant="subtitle1" gutterBottom>
              *Packed in a facility that processes dairy, gluten, peanuts and
              tree nuts.
            </Typography>
          </Grid>
        </Grid>
        <hr />
        <Box padding={1}>
          <ProductDetails
            description={description}
            ingredients={ingredients}
            instructions={instruction}
            allergens={allergens}
            tags={tags}
          />
        </Box>

        {a_plus_url && (
          <Row>
            <Col>
              <hr />
              <div className="a-plus-image">
                <img src={a_plus_url} alt="A+" />
              </div>
            </Col>
          </Row>
        )}
        <hr />
        <Box padding={1}>
          <Typography variant="h2" gutterBottom>
            Ratings
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Product Rating:{' '}
          </Typography>
          {avg_rating ? (
            <ProductRatingStars rating={avg_rating} />
          ) : (
            <Typography variant="body1" gutterBottom>
              No Ratings Yet
            </Typography>
          )}
          <br />
          {recentThreeComments && recentThreeComments.length > 0 && (
            <React.Fragment>
              <Typography variant="h5" component="p" gutterBottom>
                Comments:{' '}
              </Typography>
              <Box>
                {recentThreeComments.map((comment, key) => (
                  <Typography
                    key={'comment-' + key}
                    variant="body1"
                    gutterBottom
                  >
                    "{this.truncate(comment.comment, 200)}" -{' '}
                    {comment.user_name}
                  </Typography>
                ))}
              </Box>
            </React.Fragment>
          )}
        </Box>
        <hr />
        {localStorage.user && <ProductRatingForm product_id={product_id} />}
        <hr />
        <Typography variant="h2" gutterBottom>
          You might also like
        </Typography>
        {similar_products && similar_products.length > 0 && (
          <SimilarProducts>
            {similar_products.map((product) => (
              <Product
                key={product.product_name}
                product={product}
                onProductClick={() =>
                  this.handleProductClick(product.product_id)
                }
              />
            ))}
          </SimilarProducts>
        )}
      </div>
    );
  }
}

export default connect('store')(ProductModal);

function Brand({ manufacturer, vendor, onClick }) {
  const theme = useTheme();
  return vendor && vendor.name && vendor.fbw && vendor.url_name ? (
    <Link
      onClick={onClick}
      to={'/shop/brands/' + vendor.url_name}
      style={{ color: theme.palette.primary.main }}
    >
      <Typography variant="body1" component="span">
        {vendor.name}
      </Typography>
    </Link>
  ) : (
    <Typography variant="body1" component="span">
      {manufacturer}
    </Typography>
  );
}

function ProductDetails({
  description,
  ingredients,
  instructions,
  allergens,
  tags,
}) {
  return (
    <>
      <Typography variant="h2" gutterBottom>
        About
      </Typography>
      {description && (
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      )}
      {ingredients && ingredients.length > 0 && (
        <>
          <Typography style={{ fontWeight: 'bold' }} gutterBottom>
            Ingredients:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {ingredients.join(', ')}
          </Typography>
        </>
      )}
      {instructions && (
        <>
          <Typography style={{ fontWeight: 'bold' }} gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {instructions}
          </Typography>
        </>
      )}
      {allergens && allergens.length > 0 && (
        <>
          <Typography style={{ fontWeight: 'bold' }} gutterBottom>
            Allergens:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {allergens.join(', ')}
          </Typography>
        </>
      )}
      {tags && tags.length > 0 && (
        <>
          <Typography style={{ fontWeight: 'bold' }} gutterBottom>
            Product Highlights:
          </Typography>
          <ul aria-label="product highlights">
            {tags.map((tag) => (
              <li key={tag}>
                <Typography variant="body1" gutterBottom>
                  {tag}
                </Typography>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function createCarouselSlides(
  imageRefs,
  ingredientLabels,
  name,
  nutritionFacts,
  productId,
) {
  var images = imageRefs;
  if (nutritionFacts) images = [...images, ...nutritionFacts];
  if (ingredientLabels) images = [...images, ...ingredientLabels];
  var slides = [];
  var thumbnails = [];

  images.forEach((image) => {
    const src = PRODUCT_BASE_URL + productId + '/' + image;
    slides.push(<ImageWithZoom src={src} alt={name} />);
    thumbnails.push(<Image src={src} alt={name} />);
  });

  return { slides, thumbnails };
}

function JarIcons({ packagingSize }) {
  return (
    <div className="jar-icons">
      <div>
        <img
          src={
            packagingSize === 8
              ? `/images/jar8_icon.png`
              : `/images/jar8_grey_icon.png`
          }
          alt="Packaging size 8 oz"
          width="22"
        />
        <div>8 oz</div>
      </div>
      <div>
        <img
          src={
            packagingSize === 16 || packagingSize === 25
              ? `/images/jar8_icon.png`
              : `/images/jar8_grey_icon.png`
          }
          alt="Packaging size 25 oz"
          width="26"
        />
        <div>{packagingSize === 16 ? '16 oz' : '25 oz'}</div>
      </div>
      <div>
        <img
          src={
            packagingSize === 32
              ? `/images/jar8_icon.png`
              : `/images/jar8_grey_icon.png`
          }
          alt="Packaging size 32 oz"
          width="30"
        />
        <div>32 oz</div>
      </div>
      <div>
        <img
          src={
            packagingSize === 64
              ? `/images/jar8_icon.png`
              : `/images/jar8_grey_icon.png`
          }
          alt="Packaging size 64 oz"
          width="34"
        />
        <div>64 oz</div>
      </div>
    </div>
  );
}
