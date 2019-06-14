import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {
  Modal,
  ModalHeader,
	ModalBody,
	FormGroup,
	Input,
	Container,
	Button
} from 'reactstrap'
import { connect } from '../../../utils'

class ModalMissing extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedSubs: [],
			checked: {}
		}
		this.adminStore = this.props.store.admin
	}

  componentDidMount = () => {
    this.loadSubInfo()
  }

  loadSubInfo = () => {
    const {shopitemId, location, deliveryDate} = this.props
    this.adminStore.getSubInfo(shopitemId, deliveryDate, location)
	}

	isDuplicate = (sub) => {
		const productIds = this.state.selectedSubs.map(selectedSub => selectedSub.product_id)
		return productIds.includes(sub.product_id)
	}
	
	handleAvailableCheck = (sub, i) => {
		const {isDuplicate} = this
		const newChecked = {
			...this.state.checked,
			[i]: !this.state.checked[i]
		}
		this.setState({
			checked: newChecked
		})
		if (newChecked[i] && !isDuplicate(sub)) {
			this.setState({
				selectedSubs: [...this.state.selectedSubs, sub]
			})
		} else {
			const selectedSubs = this.state.selectedSubs.filter(selectedSub => {
				return selectedSub.product_id !== sub.product_id
			})
			this.setState({selectedSubs})
		}
	}

	handleSubmit = async() => {
		const {deliveryDate, shopitemId, toggleModal} = this.props
		const {selectedSubs} = this.state
		await this.adminStore.updateDailySubstitute(deliveryDate, shopitemId, selectedSubs)
		toggleModal()
	}

  render() {
    const {showModal, toggleModal, productName} = this.props
    const {availableSubs} = this.adminStore
    return (
      <Modal isOpen={showModal} toggle={toggleModal} className="modal-missing">
				<ModalHeader className="pt-4">Substitutes for {productName}</ModalHeader>
        <ModalBody className="pt-0 pb-2">
					<Container>
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
												<FormGroup>
													<Input
														className="ml-sm-3"
														name={sub.product_id}
														checked={!!this.state.checked[i]}
														type="checkbox"
														onChange={(e) => this.handleAvailableCheck(sub, i)}
													/>
												</FormGroup>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						<Container className="mt-4 btn-center">
							<Button color="primary" onClick={this.handleSubmit}>Submit</Button>
						</Container>
					</Container>
        </ModalBody>
      </Modal>
    )
  }
}

export default connect("store")(ModalMissing)
