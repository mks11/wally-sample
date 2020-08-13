import { Component } from "react";

import { logPageView, logModalView } from "services/google-analytics";
import { connect } from "../utils";

class ReferFriend extends Component {
  constructor(props) {
    super(props);

    this.userStore = this.props.store.user;
    this.modalStore = this.props.store.modal;
    this.routing = this.props.store.routing;
  }

  componentDidMount() {
    this.userStore.getStatus().then((status) => {
      if (!status) {
        this.props.store.routing.push("/main");
      } else {
        // Store page view in google analytics
        const { location } = this.routing;
        logPageView(location.pathname);

        logModalView("/refer");

        this.modalStore.toggleModal("referral");
        this.props.store.routing.push("/main");
      }
    });
  }

  render() {
    return null;
  }
}

export default connect("store")(ReferFriend);
