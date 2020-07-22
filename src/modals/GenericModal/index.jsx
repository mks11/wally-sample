import React, { Component } from "react";
import PropTypes from "prop-types";

class GeneralPurposeModal extends Component {
  render() {
    const { modal } = this.props.stores;
    return modal.childrenComponent
  }
}

GeneralPurposeModal.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GeneralPurposeModal;
