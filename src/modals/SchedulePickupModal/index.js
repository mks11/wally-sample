// Node Modules
import React, { Component } from "react";
import PropTypes from "prop-types";

// Utilities
import { connect } from "../../utils";

// Components
import { Container } from "@material-ui/core";
import SchedulePickupForm from "./SchedulePickupForm";

class SchedulePickupModal extends Component {
  constructor(props) {
    super(props);

    this.userStore = props.store.user;
    this.modalStore = props.store.modal;
    this.loadingStore = props.store.loading;
  }

  render() {
    return (
      <Container maxWidth="md">
        <SchedulePickupForm
          userStore={this.userStore}
          loadingStore={this.loadingStore}
          modalStore={this.modalStore}
        />
      </Container>
    );
  }
}

SchedulePickupModal.propTypes = {
  toggle: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired,
};

export default connect("store")(SchedulePickupModal);
