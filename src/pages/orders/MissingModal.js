import React, { Component } from "react";

class MissingModal extends Component {
  render() {
    if (!this.props.isOpen) {
      return null;
    }
    return (
      <div className="backdrop-missing">
        <div className="missing-modal">
          <p>Please confirm if item is missing</p>
          <button
            className="modal-button"
            onClick={this.props.makePatchAPICall}
          >
            Yes
          </button>
          <button className="modal-button" onClick={this.props.onClose}>
            No
          </button>
        </div>
      </div>
    );
  }
}

export default MissingModal;
