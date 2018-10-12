import React, { PureComponent } from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

class CustomDropdown extends PureComponent {
  constructor(props) {
    super(props)

    const { title } = this.props

    this.state = {
      title: title,
      open: false,
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  onDropdownItemClick = (e) => {
    const { onItemClick } = this.props
    const value = e.target.id

    onItemClick(value)
    
    this.setState({
      title: value
    })
  }
  render() {
    const { frames } = this.props
    const { open, title } = this.state

    return frames && frames.length ? (
      <Dropdown isOpen={open} toggle={this.toggle} direction="down" className="aw--custom-dropdown">
        <DropdownToggle caret>{title}</DropdownToggle>
        <DropdownMenu>
          {frames.map(item => {
            return (
              <DropdownItem key={item} onClick={this.onDropdownItemClick} id={item}>
                {item}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    ) : null;
  }
}

export default CustomDropdown
