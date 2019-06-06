import React, {Component} from "react"
import Table from '@material-ui/core/Table'
import Paper from '@material-ui/core/Paper'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { connect } from '../../../utils'
import moment from 'moment'

class CurrentStatusTable extends Component {
  constructor(props) {
    super(props)
		this.adminStore = this.props.store.admin
	}
	
	componentDidMount = () => {
		this.loadCurrentStatus()
	}
	
  loadCurrentStatus = () => {
		const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`
		this.adminStore.getLocationStatus(timeframe)
	}
	
  render() {
		const {locationStatus} = this.adminStore
		const locationNames = Object.keys(locationStatus)
    return (
			<Paper elevation={1} className={"scrollable-table"}>
				<Table className={"current-status-table"}>
					<TableBody>
						{locationNames.map((locationName) => {
							const shop = locationStatus[locationName]
							return (
								<TableRow key={locationName}>
									<TableCell>{locationName}</TableCell>	
									<TableCell>{shop.num_checked} / {shop.num_total}</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</Paper>
		);
  }
}

export default connect("store")(CurrentStatusTable)
