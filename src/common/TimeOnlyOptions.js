import React, { Component } from "react";
import PropTypes from "prop-types";
import ClickOutside from "react-click-outside";
import moment from "moment";

function TimeInput({ time, unavailable, selected, key, onClick }) {
  return (
    <div className="dropdown-item" key={key} onClick={onClick}>
      <div className="custom-control custom-radio">
        <input
          checked={selected && selected.time === time}
          type="radio"
          name="timeRadio"
          className="custom-control-input"
        />
        <label className="custom-control-label">
          {time}
          {unavailable && <span className="text-muted">Not Available</span>}
        </label>
      </div>
    </div>
  );
}

class TimeOnlyOptions extends Component {
  state = {
    selected: null,
    lock: false,
    confirmHome: false,
    data: [],
    timeDropdown: false
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

  handleChangeTime({ time, unavailable }) {
    if (unavailable) {
      return;
    }
    this.setState({
      selected: { time },
      lock: true,
      timeDropdown: false
    });
    this.props.onSelectTime({ time });
  }

  unlock = () => {
    this.setState({ lock: false });
  };

  render() {
    let timeDropdownClass = "dropdown-menu";
    //TODO uncouple it from addressUnlocked
    if (this.state.timeDropdown && !this.props.addressUnlocked) {
      timeDropdownClass += " show";
    }

    const lock = this.state.lock ? this.state.lock : this.props.lock;
    const dropdown =
      typeof this.props.dropdown !== "undefined" ? this.props.dropdown : true;
    let data = this.props.data ? this.props.data : [];
    const editable = this.props.editable !== null ? this.props.editable : true;
    const selected = this.props.selected
      ? this.props.selected
      : this.state.selected;
    const showTitle = this.props.title !== null ? this.props.title : true;
    let dropdownButtonClass = "btn btn-dropdown-outline dropdown-toggle";
    if (!dropdown) {
      dropdownButtonClass += " disabled";
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
        {this.props.invalidText && (
          <span className="text-error text-left d-block mt-3">
            {this.props.invalidText}
          </span>
        )}
        <div className="dropdown show" style={this.props.invalidText ? {border:"1px solid #ff0000"}:{}}>
          <ClickOutside onClickOutside={e => this.hideTimeDropdown()}>
            <button
              onClick={e => this.toggleTimeDropdown()}
              className={dropdownButtonClass}
              type="button"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              {selected ? (
                <React.Fragment>{selected.time}</React.Fragment>
              ) : (
                this.props.placeholderText
              )}
            </button>
            <div className={timeDropdownClass}>
              {data.map(({ time, unavailable }, key) => (
                <TimeInput
                  time={time}
                  unavailable={unavailable}
                  selected={selected}
                  onClick={e => this.handleChangeTime({ time, unavailable })}
                  key={key}
                />
              ))}
            </div>
          </ClickOutside>

        </div>
      </React.Fragment>
    );
  }
}

TimeOnlyOptions.defaultProps = {
  lock: false,
  editable: false
};

TimeOnlyOptions.propTypes = {
  title: PropTypes.string,
  onSelectTime: PropTypes.func.isRequired,
  data: PropTypes.shape({
    time: PropTypes.string,
    unavailable: PropTypes.bool
  }),
  addressUnlocked: PropTypes.bool,
  placeholderText: PropTypes.string.isRequired,
  lock: PropTypes.bool,
  dropdown: PropTypes.string,
  editable: PropTypes.bool,
  invalidText: PropTypes.string
};

export default TimeOnlyOptions;
