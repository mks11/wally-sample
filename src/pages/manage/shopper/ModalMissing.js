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
			checked: {},
		}

		this.adminStore = props.store.admin
		this.modalStore = props.store.modal
	}
	
	componentDidMount() {
		console.log("Component did mount");
		this.state = {
			selectedSubs: [],
			checked: {},
		}
	}

	componentWillUnmount = () => {
		console.log("Unmounting component");
		this.adminStore.clearStoreSubs()
	}
	
	handleAvailableCheck = (sub, i) => {
		const newChecked = {
			...this.adminStore.checked,
			[i]: !this.adminStore.checked[i]
		}
		
		this.adminStore.checked = newChecked;
		this.setState({
			checked: newChecked
		})
		if (newChecked[i]) {
			this.adminStore.selectedSubs = [...this.adminStore.selectedSubs, sub];
		} else {
			const selectedSubs = this.adminStore.selectedSubs.filter(selectedSub => {
				return selectedSub.product_id !== sub.product_id
			})
			this.adminStore.selectedSubs = selectedSubs
		}
	}

	handleSubmit = () => {
		const {shopitemId, timeframe, location} = this.props
		let selectedSubs = this.adminStore.selectedSubs
		selectedSubs = selectedSubs && selectedSubs.map(sub => {
			return { ...sub, product_shop: location }
		})
		console.log(selectedSubs);
		this.adminStore.updateDailySubstitute(timeframe, shopitemId, selectedSubs)
		this.modalStore.toggleMissing()
	}

  render() {
		const {missing, toggleMissing} = this.modalStore
		const {availableSubs} = this.adminStore
		const {productName} = this.props

    return (
      <Modal isOpen={missing} className="modal-missing">
				<button className="btn-icon btn-icon--close" onClick={toggleMissing}></button>
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
														checked={!!this.adminStore.checked[i]}
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
