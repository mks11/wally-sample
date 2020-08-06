import React, {Component} from 'react';
import PreferredPickupLocationDropdown from "../../../common/DropdownPreferredPickupLocation"

class Returns extends Component {
  constructor (props) {
    super (props);

    this.state = {
      confirmReturn: false,
      selected: '',
    };
  }

  componentDidMount () {
    if (this.props.default) {
      this.setState ({
        confirmReturn: true,
        selected: this.props.default,
      });
      this.props.onReturnChange (this.state.confirmReturn, this.state.selected);
    }
  }

  handleConfirmReturn = () => {
    this.setState ({
      confirmReturn: !this.state.confirmReturn,
    });
  };

  handleSelectedReturn = (location, closeDropdown) => {
    this.setState ({
      selected: location,
    }, ()=>{
      closeDropdown()
    });
    this.props.onReturnChange(this.state.confirmReturn, location);
  }

  render () {
    const {title} = this.props;

    return (
      <div className="delivery-notes">
        <h3 className="mb-3">{title}</h3>
        <div className="custom-control custom-checkbox mt-2 mb-3">
          <input
            type="checkbox"
            className="custom-control-input"
            id="returnCheck"
            checked={this.state.confirmReturn}
            onChange={this.handleConfirmReturn}
          />
          <label
            className="custom-control-label"
            onClick={this.handleConfirmReturn}
          >
            I will be returning packaging
          </label>
        </div>
          <PreferredPickupLocationDropdown 
              disable={!this.state.confirmReturn}
              defaultLocation={this.props.default}
              handleSelected={this.handleSelectedReturn}
              selected={this.state.selected}  
          />
      </div>
    );
  }
}

export default Returns;
