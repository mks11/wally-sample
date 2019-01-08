import React, {Component} from 'react';
import {connect} from '../../../utils'
import {Container, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row} from "reactstrap"
import {
  ListGroup,
  ListGroupItem,
  Form,
  FormGroup,
  FormControl,
  Col,
  Checkbox,
  ControlLabel
} from "react-bootstrap";
import Button from '@material-ui/core/Button/Button'
import CloseIcon from '@material-ui/icons/Close';
import ArrowLeft from '@material-ui/icons/KeyboardArrowLeftOutlined';
import ArrowRight from '@material-ui/icons/KeyboardArrowRightOutlined';
import Typography from "@material-ui/core/Typography/Typography";
import Select from 'react-select'

class SingleProductView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      product: props.product,
      producer: {label: props.product.product_producer, value:props.product.product_producer, id: props.product.product_producer},
      local: props.product.local,
      organic: props.product.organic,
      shopPrice: props.product.shop_price / 100,
      farmValues: this.prepareFarmValues({
        shopitem: props.product,
        other: props.shopitemsFarms
      }),
      isEdit: false,
      missing: false,
      substitute: false,
      completed: Boolean(props.product.completed),
      subProductName: '',
      finalQuantity: '',
      totalPaid: '',
      weight: ''
    }
    this.userStore = this.props.store.user
  }

  componentDidMount() {
    console.log(this.props)
  }

  handleInputChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }


  handleSubmit(e) {
    e.preventDefault()
  }

  prepareFarmValues = ({ shopitem, other }) => {
    const { product_id, product_producer } = shopitem
    const initial = product_producer
    const restFarms = (other && other[product_id]) || []
    return [...new Set([ initial, ...restFarms ])].map(item => {
      return { id: item, title: item, label: item, value: item }
    })
  }

  render() {
    const {product, producer, isEdit, local, organic, shopPrice, substitute, missing, subProductName, finalQuantity, totalPaid, weight, farmValues, completed} = this.state
    return (
      <section className="page-section pt-1 single-product">
        <Container>
          <div className="mb-3">
            <Button variant="contained" color="default" onClick={this.props.toggle}>
              <CloseIcon/>
              <Typography>Close</Typography>
            </Button>
          </div>
          <h2>Single Product View</h2>
          <hr/>
          <Form horizontal onSubmit={this.handleSubmit}>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Product:</strong>
                </Col>
                <Col sm={10}>
                  {product.product_name}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Producer:</strong>
                </Col>
                <Col sm={10}>
                  <Select  placeholder="Producer" options={farmValues} value={producer} isDisabled={!isEdit} onChange={e => this.setState({producer: e})}/>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Quantity:</strong>
                </Col>
                <Col sm={10}>
                  {product.quantity}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Quantity (if sub.):</strong>
                </Col>
                <Col sm={10}>
                  {product.quantity_with_sub}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Local:</strong>
                </Col>
                <Col sm={10}>
                  <Input type="select" name="local" value={local} onChange={e => this.setState({local: e.target.value === "true"})}
                         disabled={!substitute}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Organic:</strong>
                </Col>
                <Col sm={10}>
                  <Input type="select" name="organic" value={organic}
                         onChange={e => this.setState({organic: e.target.value === "true"})} disabled={!substitute}>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Product Price:</strong>
                </Col>
                <Col sm={10}>
                  <InputGroup>
                    <Input placeholder="Product Price" name="shopPrice" value={shopPrice} disabled={!substitute}
                           onChange={this.handleInputChange}/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Estimated Price:</strong>
                </Col>
                <Col sm={10}>
                  {product.estimated_price / 100}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Estimated Total:</strong>
                </Col>
                <Col sm={10}>
                  {product.estimated_total}
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Substitute:</strong>
                </Col>
                <Col sm={4}>
                  <Input type="select" name="substitute" value={substitute}
                         onChange={e => this.setState({substitute: e.target.value === "true"})} disabled={ completed ? !isEdit : false}>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </Input>
                </Col>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Missing:</strong>
                </Col>
                <Col sm={4}>
                  <Input type="select" name="missing" value={missing}
                         onChange={e => this.setState({missing: e.target.value === "true"})} disabled={completed ? !isEdit : false}>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Substitute Product Name:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl placeholder="Substitute Product Name" name="subProductName" value={subProductName}
                               disabled={!substitute}
                               onChange={this.handleInputChange}/>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Final Quantity:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl placeholder="Enter Quantity" name="finalQuantity" value={finalQuantity}
                               disabled={!isEdit}
                               onChange={this.handleInputChange}/>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Total Paid:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl placeholder="Enter Total" name="totalPaid" value={totalPaid}
                               disabled={!isEdit}
                               onChange={this.handleInputChange}/>
                </Col>
              </Row>
            </FormGroup>
            <FormGroup>
              <Row>
                <Col componentClass={ControlLabel} sm={2}>
                  <strong>Weight:</strong>
                </Col>
                <Col sm={10}>
                  <FormControl placeholder="Enter Weight" name="weight" value={weight}
                               disabled={product.unit_type !== 'ea' && product.unit_type !== 'bunch' && product.unit_type !== 'pint'}
                               onChange={this.handleInputChange}/>
                </Col>
              </Row>
            </FormGroup>
            <div className="nav-buttons">
              <Button variant="contained" size={"small"} onClick={this.props.onPrevProduct}>
                <ArrowLeft/>
                Previous
              </Button>
              <Button variant="contained" color="primary" size={"large"} type={isEdit ? "submit" : "button"}
                      onClick={() => isEdit ? {} : this.setState({isEdit: true})}>
                {isEdit ? 'Submit' : 'Edit'}
              </Button>
              <Button variant="contained" size={"small"} onClick={this.props.onNextProduct}>
                Next
                <ArrowRight/>
              </Button>
            </div>
          </Form>
        </Container>
      </section>
    );
  }
}

export default connect("store")(SingleProductView);
