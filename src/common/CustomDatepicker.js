import React from "react";
import PropTypes from "prop-types";
import { Label, FormGroup } from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

class CustomDatepicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
  }

  handleChange = selected => {
    const { onDatePick } = this.props;

    this.setState({
      startDate: selected
    });

    onDatePick && onDatePick(moment(selected).format("YYYY-MM-DD"));
  };

  render() {
    const { label, selected, onDatePick, containerStyle, className, ...rest } = this.props;

    return (
      <FormGroup style={containerStyle}>
        <Label>{this.props.label}</Label>
        <DatePicker
          selected={moment(selected) || this.state.startDate}
          onChange={this.handleChange}
          dateFormat="YYYY-MM-DD"
          className={`form-control ${className}`}
          {...rest}
        />
      </FormGroup>
    );
  }
}

CustomDatepicker.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.string,
  onDatePick: PropTypes.func.isRequired,
  containerStyle: PropTypes.object
};

export default CustomDatepicker;
