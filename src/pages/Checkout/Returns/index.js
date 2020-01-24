import React, {Component} from 'react';
import ClickOutside from 'react-click-outside';

class Returns extends Component {
  constructor (props) {
    super (props);

    this.state = {
      confirmReturn: false,
      returnDropdown: false,
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

  toggleReturnDropdown (e) {
    if (this.state.confirmReturn) {
      this.setState ({returnDropdown: !this.state.returnDropdown});
    }
  }

  hideReturnDropdown (e) {
    if (!this.state.returnDropdown) {
      return;
    }

    this.setState ({returnDropdown: false});
  }

  handleConfirmReturn = () => {
    this.setState ({
      confirmReturn: !this.state.confirmReturn,
    });
  };

  handleSelectedReturn (location) {
    this.setState ({
      selected: location,
      returnDropdown: false,
    });
    this.props.onReturnChange (this.state.confirmReturn, location);
  }

  render () {
    const {title} = this.props;
    let pickupLocations = [
      'Front Door',
      'Back Door',
      'Shipping',
      'Receiving',
      'Office',
      'Mail Room',
      'Garage',
      'Upstairs',
      'Downstairs',
      'Guard House',
      'Third party',
      'Warehouse',
      'None'
    ];
    if (this.props.default) {
      pickupLocations = pickupLocations.filter(p => p != this.props.default);
    }

    let returnDropdownClass = 'dropdown-menu';
    if (this.state.returnDropdown) {
      returnDropdownClass += ' show';
    }
    let dropdownButtonClass = 'btn btn-dropdown-outline dropdown-toggle';
    if (!this.state.confirmReturn) {
      dropdownButtonClass += ' disabled';
    }

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
        <div className="dropdown show">
          <ClickOutside onClickOutside={e => this.hideReturnDropdown ()}>
            <button
              onClick={e => this.toggleReturnDropdown ()}
              className={dropdownButtonClass}
              type="button"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              {this.state.selected
                ? <React.Fragment>{this.state.selected}</React.Fragment>
                : <React.Fragment>Preferred Pickup Location</React.Fragment>}
            </button>
            <div className={returnDropdownClass}>
              {pickupLocations.map ((item, key) => {
                return (
                  <React.Fragment key={key}>
                    <div
                      className="dropdown-item"
                      onClick={e => this.handleSelectedReturn (item)}
                    >
                      <div className="custom-control custom-radio">
                        <input
                          type="radio"
                          name="timeRadio"
                          className="custom-control-input"
                          checked={this.state.selected === item}
                        />
                        <label className="custom-control-label">{item}</label>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </ClickOutside>
        </div>
      </div>
    );
  }
}

export default Returns;
