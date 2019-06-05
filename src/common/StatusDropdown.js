import React, { PureComponent } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const statusMap = {
  pending: ["available", "missing", "ugly", "too little"],
  unavailable: ["available", "missing", "ugly", "too little"],
  available: ["purchased", "missing", "ugly", "too little"],
  purchased: ["missing", "ugly", "too little"]
};

class StatusDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectedStatus: "Select",
      open: false
    };
  }

  onDropdownClick = (e) => {
    e.stopPropagation()
    this.toggle()
  };

  onDropdownItemClick = (value, e) => {
    e.stopPropagation()
    this.toggle()
    this.setState({selectedStatus: value})
    this.props.onSelect(value, this.props.shopitem._id);
  };

  toggle = () => {
    this.setState({ open: !this.state.open })

  };

  render() {
    // includes default option because test db doesn't have status property
    const statusOptions = statusMap[this.props.shopitem.status]
    const {open, selectedStatus} = this.state

    return (
      <Dropdown
        isOpen={open}
        toggle={this.toggle}
        direction="down"
        className="aw--custom-dropdown"
      >
        <DropdownToggle color="info" onClick={this.onDropdownClick} caret>
          {selectedStatus}
        </DropdownToggle>
        <DropdownMenu>
          {statusOptions.map(statusItem => {
            return (
              <DropdownItem
                key={statusItem}
                onClick={this.onDropdownItemClick.bind(this, statusItem)}
              >
                {statusItem}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default StatusDropdown;
