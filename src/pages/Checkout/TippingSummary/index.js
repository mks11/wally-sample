import React, { Component } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FontAwesome from 'react-fontawesome';

class TippingSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tippingpopup: false,
    };
  }

  showTippingPopup = () => {
    this.setState({ tippingpopup: true });
  };

  hideTippingPopup = () => {
    this.setState({ tippingpopup: false });
  };

  render() {
    const { tippingpopup } = this.state;
    const { value } = this.props;

    return (
      <div className={`summary ${tippingpopup ? 'open' : ''}`}>
        <ClickAwayListener onClickAway={() => this.hideTippingPopup()}>
          <div
            className="popover bs-popover-right"
            role="tooltip"
            x-placement="right"
            style={{ left: '142px' }}
          >
            <div className="arrow"></div>
            <div className="popover-body">
              100% of the tip amount goes to our shoppers and couriers, on top
              of the wages they earn.
            </div>
          </div>
        </ClickAwayListener>
        <span onClick={this.showTippingPopup}>
          Tip Amount <FontAwesome name="info-circle" />
        </span>
        <span>{value}</span>
      </div>
    );
  }
}

export default TippingSummary;
