import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class DeliveryTimeOptions extends Component {
  state = {
    selected: null,
    lock: false,
    confirmHome: false,
    data: [],
  };

  toggleTimeDropdown(e) {
    if (this.props.lock) {
      return;
    }
    this.setState({ timeDropdown: !this.state.timeDropdown });
  }

  hideTimeDropdown(e) {
    if (!this.state.timeDropdown) {
      return;
    }
    this.setState({ timeDropdown: false });
  }

  handleChangeTime(day, time, date, availability) {
    if (availability) {
      return;
    }
    this.setState({
      selected: { day, time, date },
      lock: true,
      timeDropdown: false,
    });
    this.props.onSelectTime({ day, date, time });
  }

  unlock = () => {
    this.setState({ lock: false });
  };

  render() {
    let timeDropdownClass = 'dropdown-menu';
    if (this.state.timeDropdown && !this.props.addressUnlocked) {
      timeDropdownClass += ' show';
    }

    const lock = this.state.lock ? this.state.lock : this.props.lock;
    const dropdown =
      typeof this.props.dropdown !== 'undefined' ? this.props.dropdown : true;
    let data = this.props.data ? this.props.data : [];
    const editable = this.props.editable !== null ? this.props.editable : true;
    const selected = this.props.selected
      ? this.props.selected
      : this.state.selected;
    const showTitle = this.props.title !== null ? this.props.title : true;
    let dropdownButtonClass = 'btn btn-dropdown-outline dropdown-toggle';
    if (!dropdown) {
      dropdownButtonClass += ' disabled';
    }

    return (
      <React.Fragment>
        {showTitle && (
          <h3 className="m-0 mb-3 p-r">
            {showTitle}
            {lock && editable && (
              <a onClick={this.unlock} className="address-rbtn link-blue">
                CHANGE
              </a>
            )}
          </h3>
        )}
        <div className="dropdown show">
          <ClickAwayListener onClickAway={(e) => this.hideTimeDropdown()}>
            <>
              <button
                onClick={(e) => this.toggleTimeDropdown()}
                className={dropdownButtonClass}
                type="button"
                data-toggle="dropdown"
                aria-expanded="true"
              >
                {selected ? (
                  <React.Fragment>
                    {selected.day}, {selected.time}
                  </React.Fragment>
                ) : (
                  'Choose delivery date and time'
                )}
              </button>
              <div className={timeDropdownClass}>
                {data.map((items, key) => (
                  <React.Fragment key={key}>
                    <h6 className="dropdown-header">{items.day}</h6>
                    {items.data.map((item, key2) => (
                      <div
                        className="dropdown-item"
                        key={key2}
                        onClick={(e) =>
                          this.handleChangeTime(
                            items.day,
                            item.time,
                            item.date,
                            item.availability,
                          )
                        }
                      >
                        <div className="custom-control custom-radio">
                          <input
                            checked={
                              this.state.selected &&
                              this.state.selected.date === item.date &&
                              this.state.selected.time === item.time
                            }
                            type="radio"
                            name="timeRadio"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label">
                            {item.time}{' '}
                            {item.availability && (
                              <span className="text-muted">Not Available</span>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          </ClickAwayListener>
        </div>
      </React.Fragment>
    );
  }
}

DeliveryTimeOptions.propTypes = {
  title: PropTypes.string,
  onSelectTime: PropTypes.func,
  lock: PropTypes.bool,
  dropdown: PropTypes.string,
  editable: PropTypes.bool,
  data: PropTypes.object,
  addressUnlocked: PropTypes.bool,
};

export default DeliveryTimeOptions;
