import React, { Component } from 'react';
import { connect } from '../../../utils';
import {
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import {
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormControl,
  Col,
  Checkbox,
  ControlLabel,
} from 'react-bootstrap';
import Button from '@material-ui/core/Button/Button';
import CloseIcon from '@material-ui/icons/Close';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftOutlined';
import ArrowRight from '@material-ui/icons/KeyboardArrowRightOutlined';
import Typography from '@material-ui/core/Typography/Typography';
import Select from 'react-select';
import Createable from 'react-select/lib/Creatable';

class SingleProductView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.product._id,
      product: props.product,
      producer: {
        label: props.product.product_producer,
        value: props.product.product_producer,
        id: props.product.product_producer,
      },
      shop: props.product.product_shop,
      local: props.product.local,
      organic: props.product.organic,
      shopPrice: props.product.shop_price / 100 || '',
      farmValues: this.prepareFarmValues({
        shopitem: props.product,
        other: props.shopitemsFarms,
      }),
      isEdit: !props.product.completed,
      missing: !!props.product.missing,
      substitute: !!props.product.substitute_for_name,
      completed: Boolean(props.product.completed),
      subProductName: props.product.substitute_for_name
        ? props.product.product_name
        : '',
      finalQuantity: props.product.final_quantity || '',
      totalPaid:
        props.product.total_paid / 100 || props.product.estimated_total / 100,
      weight: props.product.weight || '',
      missingReason: props.product.product_missing_reason || 'Out of season',
    };
    this.userStore = this.props.store.user;
    this.adminStore = this.props.store.admin;
  }

  componentDidUpdate(prevProps) {
    if (
      ((prevProps.selectedIndex || prevProps.selectedIndex === 0) &&
        prevProps.selectedIndex !== this.props.selectedIndex) ||
      prevProps.product.completed !== this.props.product.completed
    ) {
      const { props } = this;
      this.setState({
        id: props.product._id,
        product: props.product,
        producer: {
          label: props.product.product_producer,
          value: props.product.product_producer,
          id: props.product.product_producer,
        },
        local: props.product.local,
        organic: props.product.organic,
        shopPrice: props.product.shop_price / 100 || '',
        farmValues: this.prepareFarmValues({
          shopitem: props.product,
          other: props.shopitemsFarms,
        }),
        isEdit: !props.product.completed,
        missing: !!props.product.missing,
        substitute: !!props.product.substitute_for_name,
        completed: Boolean(props.product.completed),
        subProductName: props.product.substitute_for_name
          ? props.product.product_name
          : '',
        finalQuantity: props.product.final_quantity || '',
        totalPaid:
          props.product.total_paid / 100 || props.product.estimated_total / 100,
        weight: props.product.weight || '',
        missingReason: props.product.product_missing_reason || 'Out of season',
      });
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      id,
      isEdit,
      product,
      shopPrice,
      completed,
      organic,
      local,
      producer,
      shop,
      substitute,
      quantity,
      missing,
      finalQuantity,
      totalPaid,
      weight,
      missingReason,
      subProductName,
    } = this.state;
    const data = {
      id,
      product_id: product.product_id,
      inventory_id: product.inventory_id,
      product_producer: producer.value,
      product_shop: shop,
      product_location: producer.value,
      product_name: substitute ? subProductName : product.product_name,
      missing,
      local,
      completed,
      substitute,
      organic,
      quantity,
      final_quantity: Number(finalQuantity),
      shop_price: Number(shopPrice) * 100,
      total_paid: Number(totalPaid) * 100,
      weight: Number(weight),
      substitute_for_name: substitute ? product.product_name : null,
      product_missing_reason: missingReason,
    };
    if (isEdit) {
      this.adminStore.updateShopItem(
        this.props.timeframe,
        id,
        data,
        this.props.toggle,
        this.props.selectedIndex,
      );
      if (substitute) this.setState({ subProductName: product.product_name });
      this.setState({ isEdit: false });
    } else {
      this.setState({ isEdit: true });
    }
  };

  prepareFarmValues = ({ shopitem, other }) => {
    const { product_id, product_producer } = shopitem;
    const initial = product_producer;
    const restFarms = other || [];
    return [...new Set([initial, ...restFarms])]
      .map((item) => {
        if (item) {
          return { id: item, title: item, label: item, value: item };
        }
      })
      .filter((n) => n);
  };

  handleProducerChange = (e) => {
    this.setState({ producer: e });
  };

  render() {
    const {
      product,
      producer,
      shop,
      isEdit,
      local,
      organic,
      shopPrice,
      substitute,
      missing,
      subProductName,
      finalQuantity,
      totalPaid,
      weight,
      farmValues,
      completed,
      missingReason,
    } = this.state;
    return (
      <section className="page-section pt-1 single-product">
        <Container>
          <div className="mb-3">
            <Button
              variant="contained"
              color="default"
              onClick={() => this.props.toggle()}
            >
              <CloseIcon />
              <Typography>Close</Typography>
            </Button>
          </div>
          <h2>Single Product View</h2>
          <hr />
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Product:</strong>
                </Col>
                <Col sm={10}>{product.product_name}</Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Quantity:</strong>
                </Col>
                <Col sm={10}>
                  {product.unit_type === 'packaging'
                    ? product.quantity + ' ' + product.packaging_name
                    : product.quantity +
                      ' ' +
                      (product.unit_type || product.price_unit)}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Producer:</strong>
                </Col>
                <Col sm={10}>
                  <Createable
                    isClearable
                    placeholder="Producer"
                    options={farmValues}
                    value={producer}
                    isDisabled={!isEdit}
                    formatCreateLabel={(label) => (
                      <div>New producer: {label}</div>
                    )}
                    onChange={this.handleProducerChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Shop:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl
                    placeholder="Shop Name"
                    name="shop"
                    value={shop}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Local:</strong>
                </Col>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="local"
                    value={local}
                    onChange={(e) =>
                      this.setState({ local: e.target.value === 'true' })
                    }
                    disabled={!isEdit || (isEdit && !substitute)}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Organic:</strong>
                </Col>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="organic"
                    value={organic}
                    onChange={(e) =>
                      this.setState({ organic: e.target.value === 'true' })
                    }
                    disabled={!isEdit || (isEdit && !substitute)}
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Shop Price:</strong>
                </Col>
                <Col sm={10}>
                  <InputGroup>
                    <Input
                      placeholder="Shop Price"
                      name="shopPrice"
                      value={shopPrice}
                      disabled={!isEdit || (isEdit && !substitute)}
                      onChange={this.handleInputChange}
                    />
                    <InputGroupAddon addonType="append">
                      <InputGroupText>$ / {product.price_unit}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Wally Shop Price:</strong>
                </Col>
                <Col sm={10}>
                  ${product.estimated_total / product.quantity / 100} /{' '}
                  {product.unit_type}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Estimated Total:</strong>
                </Col>
                <Col sm={10}>
                  $
                  {product.estimated_total ? product.estimated_total / 100 : ''}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Substitute:</strong>
                </Col>
                <Col sm={4}>
                  <Input
                    type="select"
                    name="substitute"
                    value={substitute}
                    onChange={(e) =>
                      this.setState({ substitute: e.target.value === 'true' })
                    }
                    disabled={
                      completed === false
                        ? false
                        : completed
                        ? !isEdit
                        : !isEdit
                    }
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Input>
                </Col>
                <Col as={ControlLabel} sm={2}>
                  <strong>Missing:</strong>
                </Col>
                <Col sm={4}>
                  <Input
                    type="select"
                    name="missing"
                    value={missing}
                    onChange={(e) =>
                      this.setState({ missing: e.target.value === 'true' })
                    }
                    disabled={
                      completed === false
                        ? false
                        : completed
                        ? !isEdit
                        : !isEdit
                    }
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Substitute Product Name:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl
                    placeholder="Substitute Product Name"
                    name="subProductName"
                    value={subProductName}
                    disabled={!isEdit || (isEdit && !substitute)}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>
                    Final Quantity (
                    {product.unit_type != 'oz' ? product.unit_type : 'lbs'}):
                  </strong>
                </Col>
                <Col sm={10}>
                  <FormControl
                    placeholder="Enter Quantity"
                    name="finalQuantity"
                    value={finalQuantity}
                    disabled={completed === false ? false : !isEdit}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Total Paid ($):</strong>
                </Col>
                <Col sm={10}>
                  <FormControl
                    placeholder="Enter Total"
                    name="totalPaid"
                    value={totalPaid}
                    disabled={completed === false ? false : !isEdit}
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Weight (lbs):</strong>
                </Col>
                <Col sm={10}>
                  <FormControl
                    placeholder="Enter Weight"
                    name="weight"
                    value={weight}
                    disabled={
                      !isEdit ||
                      (isEdit &&
                        product.unit_type !== 'ea' &&
                        product.unit_type !== 'bunch' &&
                        product.unit_type !== 'packaging' &&
                        product.shop_price_unit !== 'lb' &&
                        product.shop_price_unit !== 'oz')
                    }
                    onChange={this.handleInputChange}
                  />
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col as={ControlLabel} sm={2}>
                  <strong>Missing Product Reason:</strong>
                </Col>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="missing_reason"
                    value={missingReason}
                    onChange={(e) =>
                      this.setState({ missingReason: e.target.value })
                    }
                    disabled={!isEdit || (isEdit && !missing && !substitute)}
                  >
                    <option value="Out of season">Out of season</option>
                    <option value="Vendor missing">Vendor missing</option>
                    <option value="Out of stock">Out of stock</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <div className="nav-buttons">
              <Button
                variant="contained"
                size={'small'}
                onClick={this.props.onPrevProduct}
                disabled={this.props.prevDisabled || this.adminStore.loading}
              >
                <ArrowLeft />
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                size={'large'}
                type={'submit'}
                disabled={this.adminStore.loading}
              >
                {isEdit ? 'Submit' : 'Edit'}
              </Button>
              <Button
                variant="contained"
                size={'small'}
                onClick={this.props.onNextProduct}
                disabled={this.props.prevDisabled || this.adminStore.loading}
              >
                Next
                <ArrowRight />
              </Button>
            </div>
          </Form>
        </Container>
      </section>
    );
  }
}

export default connect('store')(SingleProductViewReceipt);
