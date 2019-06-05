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
	FormGroup,
	Input,
	Container,
} from 'reactstrap'
import { Button } from '@material-ui/core';


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
	
	handleAvailableCheck = (e) => {
		console.log('e.target.name :', e.target.name);
		debugger
		this.setState({
			selectedSubs: [...this.state.selectedSubs, e.target.name]
		})
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
				<ModalHeader>Substitutes for {productName}</ModalHeader>
        <ModalBody>
					<Container>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Product Name</TableCell>
									<TableCell>Available?</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{availableSubs.map(sub => (
									<TableRow>
										<TableCell>{sub.product_name}</TableCell>
										<TableCell>
											<FormGroup check>
												<Input className="ml-sm-1 mb-sm-1" name={sub.product_id} type="checkbox"
													onChange={this.handleAvailableCheck}
												/>
											</FormGroup>
										</TableCell>
									</TableRow>
								))}
								<Button onClick={this.handleSubmit}>Submit</Button>
							</TableBody>
						</Table>
					</Container>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect("store")(ModalMissing)
