import React from 'react';
import { Label, FormGroup } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
 
import 'react-datepicker/dist/react-datepicker.css';
 
class CustomDatepicker extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      startDate: moment()
    };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange(date) {
    const { onDatePick } = this.props

    this.setState({
      startDate: date
    });

    onDatePick && onDatePick(moment(date).format('YYYY-MM-DD'))
  }
 
  render() {
    const { date } = this.props

    return (
      <FormGroup>
        <Label>Post Date</Label>
        <DatePicker
          selected={moment(date) || this.state.startDate}
          onChange={this.handleChange}
          dateFormat="YYYY-MM-DD"
          className="form-control custom-datepicker"
        />
      </FormGroup>
    )
  }
}

export default CustomDatepicker
