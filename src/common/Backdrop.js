import React, { Component } from 'react';
import { connect } from '../utils'

class Backdrop extends Component {
  render() {
    const uiStore = this.props.store.ui
    const userStore= this.props.store.user
    let isAdmin = false
    if (userStore.user) {
      const user = userStore.user
      isAdmin = user.type === 'admin'
    }
    return (
      <div className={`backdrop-wrap d-none ${uiStore.backdrop ? 'backdrop-wrap' : ''}`}>
        <div className="backdrop white" onClick={e => uiStore.hideAllDropdown()}/>
        <div style={{top: uiStore.backdropTop+'px', zIndex: uiStore.backdropZindex}} className={`backdrop ${isAdmin ? 'admin-backdrop' : ''}`} onClick={e => uiStore.hideAllDropdown()}/>
      </div>
    );
  }
}

export default connect("store")(Backdrop);
