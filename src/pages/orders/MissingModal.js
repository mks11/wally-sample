import React, { Component } from "react";

class MissingModal extends Component {
  render() {
    if (!this.props.isOpen) {
      return null;
    }
    return (
      <div className="backdrop-missing">
        <div className="missing-modal">
          <p>Please click yes to confirm if item is missing/not missing</p>
          <button className="modal-button" onClick={this.props.onConfirm}>
            Yes
          </button>
          <button className="modal-button" onClick={this.props.onCancel}>
            No
          </button>
        </div>
      </div>
    );
  }
}

export default MissingModal;
