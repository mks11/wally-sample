import React, { Component } from 'react';
import { connect } from '../utils'
import ClickOutside from 'react-click-outside'

class Outside extends Component {
  constructor(props) {
    super(props)

    this.uiStore = this.props.store.ui
  }

  handleToggle(e) {
    this.uiStore.hideAllDropdown()
  }

  render() {
    const store = this.props.store

    return (
      <ClickOutside onClickOutside={e => this.handleToggle(e)}>
      </ClickOutside>
    );
  }
}

export default connect("store")(Outside);
