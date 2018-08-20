import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { connect } from '../utils'

class Backdrop extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const uiStore = this.props.store.ui
    let className = "backdrop-wrap d-none"
    if (uiStore.backdrop) {
      className = 'backdrop-wrap'
    }
    return (
      <div className={className}>
        <div className="backdrop white" onClick={e => uiStore.hideAllDropdown()}>
        </div>
        <div style={{top: uiStore.backdropTop+'px', zIndex: uiStore.backdropZindex}} className="backdrop" onClick={e => uiStore.hideAllDropdown()}>
        </div>
      </div>
    );
  }
}

export default connect("store")(Backdrop);
