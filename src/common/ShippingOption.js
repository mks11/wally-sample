import React, { Component } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class ShippingOption extends Component {
  state = {
    selected: null,
    data: [],
  };

  componentDidMount() {
    this.setState({
      selected: 'UPS Ground (1-5 Days)',
    });
  }

  toggleTimeDropdown(e) {
    this.setState({ timeDropdown: !this.state.timeDropdown });
  }

  hideTimeDropdown() {
    if (!this.state.timeDropdown) {
      return;
    }

    this.setState({ timeDropdown: false });
  }

  render() {
    let timeDropdownClass = 'dropdown-menu';
    if (this.state.timeDropdown && !this.props.addressUnlocked) {
      timeDropdownClass += ' show';
    }
    const dropdown =
      typeof this.props.dropdown !== 'undefined' ? this.props.dropdown : true;
    const showTitle = this.props.title !== null ? this.props.title : true;
    let dropdownButtonClass = 'btn btn-dropdown-outline dropdown-toggle';
    if (!dropdown) {
      dropdownButtonClass += ' disabled';
    }

    return (
      <React.Fragment>
        {showTitle && <h3 className="m-0 mb-3 p-r">{showTitle}</h3>}
        <ClickAwayListener onClickAway={() => this.hideTimeDropdown()}>
          <div className="dropdown show">
            <button
              onClick={(e) => this.toggleTimeDropdown()}
              className={dropdownButtonClass}
              type="button"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              <React.Fragment>UPS Ground (1-5 Days)</React.Fragment>
            </button>
            <div className={timeDropdownClass}>
              <div
                className="dropdown-item"
                onClick={(e) => this.toggleTimeDropdown()}
              >
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    name="timeRadio"
                    checked={this.state.selected === 'UPS Ground (1-5 Days)'}
                    className="custom-control-input"
                  />
                  <label className="custom-control-label">
                    {this.state.selected}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      </React.Fragment>
    );
  }
}

export default ShippingOption;
