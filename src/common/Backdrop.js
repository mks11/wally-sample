import React, { Component } from 'react';
import { connect } from '../utils'

class Backdrop extends Component {
  render() {
    const uiStore = this.props.store.ui
    return (
      <div className={`backdrop-wrap d-none ${uiStore.backdrop ? 'backdrop-wrap' : ''}`}>
        <div className="backdrop white" onClick={e => uiStore.hideAllDropdown()}></div>
        <div
          style={{
            top: uiStore.backdropTop + 'px',
            zIndex: uiStore.backdropZindex
          }}
          className="backdrop"
          onClick={e => uiStore.hideAllDropdown()}
        ></div>
      </div>
    );
  }
}

export default connect("store")(Backdrop);
