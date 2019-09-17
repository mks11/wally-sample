import React, { Component } from "react";
import ClickOutside from "react-click-outside";

class DeliveryTimeOptions extends Component {
  state = {
    selected: null,
    lock: false,
    confirmHome: false,
    data: []
  };

  componentDidMount() {
    if (this.props.user.is_ecomm) {
      this.setState({
        confirmHome: true,
        selected: "UPS Ground (1-5 Days)"
      });
      //this.props.onSelectTime(null, null, null);
    }
  }

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
      timeDropdown: false
    });

    this.props.onSelectTime({ day, date, time });
  }

  unlock = () => {
    this.setState({ lock: false });
  };

  render() {
    let timeDropdownClass = "dropdown-menu";
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
    const is_ecomm = this.props.user.is_ecomm;
    const showTitle = this.props.title !== null ? this.props.title : true;
    let dropdownButtonClass = "btn btn-dropdown-outline dropdown-toggle";
    if (!dropdown) {
      dropdownButtonClass += " disabled";
    }

    return (
      <React.Fragment>
        {showTitle && (
          <h3 className="m-0 mb-3 p-r">
            {is_ecomm ? "Shipping Option" : "Time"}
            {lock && editable && (
              <a onClick={this.unlock} className="address-rbtn link-blue">
                CHANGE
              </a>
            )}
          </h3>
        )}
        <div className="dropdown show">
          <ClickOutside onClickOutside={e => this.hideTimeDropdown()}>
            <button
              onClick={e => this.toggleTimeDropdown()}
              className={dropdownButtonClass}
              type="button"
              data-toggle="dropdown"
              aria-expanded="true"
            >
              {!is_ecomm &&
                (selected ? (
                  <React.Fragment>
                    {selected.day}, {selected.time}
                  </React.Fragment>
                ) : (
                  "Choose delivery date and time"
                ))}
              {is_ecomm && (
                <React.Fragment>UPS Ground (1-5 Days)</React.Fragment>
              )}
            </button>
            <div className={timeDropdownClass}>
              {is_ecomm && (
                <div
                  className="dropdown-item"
                  onClick={e => this.toggleTimeDropdown()}
                >
                  <div className="custom-control custom-radio">
                    <input
                      type="radio"
                      name="timeRadio"
                      checked={this.state.selected === "UPS Ground (1-5 Days)"}
                      className="custom-control-input"
                    />
                    <label className="custom-control-label">
                      {this.state.selected}
                    </label>
                  </div>
                </div>
              )}
              {!is_ecomm &&
                data.map((items, key) => (
                  <React.Fragment key={key}>
                    <h6 className="dropdown-header">{items.day}</h6>
                    {items.data.map((item, key2) => (
                      <div
                        className="dropdown-item"
                        key={key2}
                        onClick={e =>
                          this.handleChangeTime(
                            items.day,
                            item.time,
                            item.date,
                            item.availability
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
                            {item.time}{" "}
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
          </ClickOutside>
        </div>
      </React.Fragment>
    );
  }
}

export default DeliveryTimeOptions;
