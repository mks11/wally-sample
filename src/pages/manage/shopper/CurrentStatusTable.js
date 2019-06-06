import React, {Component} from "react"
import Table from '@material-ui/core/Table';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter'
import {connect} from '../../../utils'

class CurrentStatusTable extends Component {
  constructor(props) {
    super(props)
		this.state = {
		}
		
		this.adminStore = this.props.store.admin
	}
	
	componentDidMount = () => {
		// this.loadCurrentStatus();

	}
	
  loadCurrentStatus = async() => {
		// const timeframe = `${moment().format('YYYY-MM-DD')} 2:00-8:00PM`
		// await this.adminStore.getLocationStatus(timeframe)
	}
	
	
  render() {
		// const { locationStatus } = this.props
		const locationStatus = { 
			"Bushwick Food Coop": {
			"num_checked": 5,
			"num_total": 10
			},
			"Greene Grape": {
			"num_checked": 5,
			"num_total": 10
			}
		}
			
		const locationNames = Object.keys(locationStatus)
		console.log('locationNames :', locationNames);
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
