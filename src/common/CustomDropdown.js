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
    const value = e.target.getAttribute('attr-id')

    onItemClick && onItemClick(value)
    
    this.setState({
      title: value
    })
  }
  render() {
    const { values } = this.props
    const { open, title } = this.state

    return values && values.length ? (
      <Dropdown isOpen={open} toggle={this.toggle} direction="down" className="aw--custom-dropdown">
        <DropdownToggle caret>{title}</DropdownToggle>
        <DropdownMenu>
          {values.map(item => {
            return (
              <DropdownItem key={item} onClick={this.onDropdownItemClick} attr-id={item}>
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
