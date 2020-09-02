import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClickOutside from 'react-click-outside';

class CarbonBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showInfo: false,
    };
  }

  toggleCarbonBarInfo = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  hideCarbonBarInfo = () => {
    this.setState({ showInfo: false });
  };

  getFeedback = (nItems) => {
    return ` ${nItems ? 12 - (nItems % 12) : 12} jars from fully minimizing
          your carbon footprint ${' '}`;
  };

  getWidthInPercent = (nItems) => {
    let percent = (nItems % 12) * (100 / 12);
    return `${percent}%`;
  };

  render() {
    const { showInfo } = this.state;
    const { show = true, nCartItems = 0 } = this.props;

    if (!show) {
      return null;
    }

    return (
      <div className="carbon-bar-wrapper">
        <div
          className={`carbon-bar-info package-info ${showInfo ? 'open' : ''}`}
        >
          {this.getFeedback(nCartItems)}
          <i onClick={this.toggleCarbonBarInfo} className="fa fa-info-circle" />
          <ClickOutside onClickOutside={this.hideCarbonBarInfo}>
            <div className="package-info-popover">
              <p>
                Our totes are designed to hold 12 jars. By fully utilizing a
                tote, you are minimizing the carbon effects of your order
              </p>
            </div>
          </ClickOutside>
        </div>
        <div className="carbon-bar">
          <div
            className="carbon-bar-value"
            style={{ width: this.getWidthInPercent(nCartItems) }}
          />
        </div>
      </div>
    );
  }
}

export default CarbonBar;

CarbonBar.propTypes = {
  nCartItems: PropTypes.number.isRequired,
  show: PropTypes.bool,
};
