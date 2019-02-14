import React, {PureComponent} from "react"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap"

class CustomDropdown extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      values: [],
      title: '',
      open: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.values.length !== prevState.values.length) {
      if (nextProps.values.length) {
        return {
          values: nextProps.values,
          title: nextProps.values[0].title
        }
      } else {
        return {
          values: [],
          title: ''
        }
      }
    }
    else return null;
  }


  toggle = () => {
    this.setState(prevState => ({
      open: !prevState.open
    }));
  }

  onDropdownItemClick = (e) => {
    const {onItemClick} = this.props
    const {values} = this.state
    const valueId = e.target.getAttribute('attr-id')

    onItemClick && onItemClick(valueId)
    this.setState({
      title: values.find(item => item.id === valueId).title
    })
  }

  render() {
    const {values} = this.props
    const {open, title} = this.state

    return values && values.length ? (
      <Dropdown isOpen={open} toggle={this.toggle} direction="down" className="aw--custom-dropdown">
        <DropdownToggle color="info" caret>{title}</DropdownToggle>
        <DropdownMenu>
          {values.map(item => {
            return (
              <DropdownItem key={item.id} onClick={this.onDropdownItemClick} attr-id={item.id}>
                {item.title}
              </DropdownItem>
            );
          })}
        </DropdownMenu>
      </Dropdown>
    ) : null;
  }
}

export default CustomDropdown
