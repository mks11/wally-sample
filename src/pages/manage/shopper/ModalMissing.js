import React, { Component } from 'react'
import { connect } from '../../../utils'
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {
  Modal,
  ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Input,
	Container,
	Button
} from 'reactstrap'


class ModalMissing extends Component {

	constructor() {
		super()
		this.state = {
			selectedSubs: []
		}
	}
  componentDidMount = () => {
    // this.loadSubInfo()
  }

  loadSubInfo = () => {
    const { shopitemId, productName, location, deliveryDate } = this.props
    this.adminStore.getSubInfo(shopitemId, deliveryDate, location)
	}

	isDuplicate = (sub) => {
		const productIds = this.state.selectedSubs.map(selectedSub => selectedSub.product_id)
		console.log('productIds :', productIds);
		return productIds.includes(sub.product_id)
	}
	
	handleAvailableCheck = async(sub, e) => {
		console.log('e.target.value :', e.target.checked, e.target.value);
		console.log('sub :', sub);
		if (e.target.checked && !this.isDuplicate(sub)) {
			await this.setState({
				selectedSubs: [...this.state.selectedSubs, sub]
			})
		} else {
			const selectedSubs = this.state.selectedSubs.filter(selectedSub => {
				return selectedSub.product_id !== sub.product_id
			})
			await this.setState({ selectedSubs })
		}
		console.log('this.state.selectedSubs :', this.state.selectedSubs);
	}

  render() {
    const { showModal, toggleModal, productName, location, deliveryDate } = this.props
    // const { availableSubs } = this.adminStore
    const availableSubs = [
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_234",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_345",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
			{
				"product_id": "prod_123",
				"product_name": "Carrots",
				"price": 100,
				"price_unit": "ea"
			},
    ]

    return (
      <Modal isOpen={showModal} toggle={toggleModal} className="modal-missing">
				<ModalHeader className="pt-4">Substitutes for {productName}</ModalHeader>
        <ModalBody className="pt-0 pb-2">
					<Container>
					<Form>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Product Name</TableCell>
										<TableCell>Available?</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{availableSubs.map((sub, i) => (
										<TableRow key={i}>
											<TableCell>{sub.product_name}</TableCell>
											<TableCell>
													<Input className="ml-sm-3" name={sub.product_id} type="checkbox"
														onChange={(e) => this.handleAvailableCheck(sub, e)}
													/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						<Container className="mt-4 btn-center">
							<Button color="primary" onClick={this.handleSubmit}>Submit</Button>
						</Container>
						</Form>
					</Container>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect("store")(ModalMissing)
