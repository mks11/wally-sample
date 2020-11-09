import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FontAwesome from 'react-fontawesome';

class ServiceSummary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      servicepopup: false,
    };
  }

  showServicePopup = () => {
    this.setState({ servicepopup: true });
  };

  hideServicePopup = () => {
    this.setState({ servicepopup: false });
  };

  render() {
    const { servicepopup } = this.state;
    const { value } = this.props;

    return (
      <div className={`summary ${servicepopup ? 'open' : ''}`}>
        <ClickAwayListener onClickAway={() => this.hideServicePopup()}>
          <div
            className="popover bs-popover-right"
            role="tooltip"
            x-placement="right"
          >
            <div className="arrow"></div>
            <h3 className="popover-header"></h3>
            <div className="popover-body">
              <Link
                className="text-violet"
                to={'/help/topics/5b919926d94b070836bd5e4b'}
              >
                Learn more
              </Link>
            </div>
          </div>
        </ClickAwayListener>
        <span onClick={this.showServicePopup}>
          Service fee <FontAwesome name="info-circle" />
        </span>
        <span>{value}</span>
      </div>
    );
  }
}

export default ServiceSummary;
