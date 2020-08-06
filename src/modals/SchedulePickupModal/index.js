import React, { PureComponent, Component } from "react";
import {
  connect,
  isValidTimeOrder,
  genTimePoints
} from "../../utils";
import PropTypes from "prop-types";
import moment from "moment";
import DatePicker from "react-datepicker";
import TimeOnlyOptions from "../../common/TimeOnlyOptions";
import AddressOptionsManaged from "./AddressOptionsManaged";

const ErrorInfo = props => {
  return props.invalidText ? (
    <div className="container">
      <span className="text-error text-center my-3">{props.invalidText}</span>
    </div>
  ) : null;
};

const InputErrors = ({ errors }) => {
  if (errors && errors.length < 1) {
    return null;
  }
  return (
    <div className="container">
      <span className="text-error text-center my-3">{`Invalid ${
        errors.length > 1 ? "inputs" : "input"
      }`}</span>
      <ul>
        {errors.map((msg, i) => (
          <li key={i} className="text-error util-font-size-14">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

function Container(props) {
  return <div className="mt-4" {...props} />;
}

class SchedulePickup extends PureComponent {
  constructor(props) {
    super(props);

    this.schedulePickupStore = props.store.schedulePickup;
    this.userStore = props.store.user;
    this.modalStore = props.store.modal;

    const selectedAddressId =
      (this.userStore.selectedDeliveryAddress &&
        this.userStore.selectedDeliveryAddress.address_id) ||
      (this.userStore.user && this.userStore.user.preferred_address);

    this.state = {
      pickupDate: "",
      selectedAddressId: selectedAddressId,
      earliestTime: props.earliestTime,
      latestTime: null,
      preferredLocation: "",
      isFetching: false,
      successText: "", //to add

      invalidLatestTime: false,
      requestFailedText: null, // on submit if error occurred
      showIncompleteFieldErrors: false // if any field is invalid, before submission
    };
  }

  checkValidityTime = () => {
    const isValid = isValidTimeOrder(
      this.state.earliestTime,
      this.state.latestTime
    );
    if (!isValid) {
      this.setState({
        invalidLatestTime: true // only make the latest time invalid
      });
    } else {
      this.setState({
        invalidLatestTime: false
      });
    }
  };

  clearRequestFailText = () => {
    this.setState({
      requestFailedText: null
    });
  };

  handleSelectEarliestTime = ({ time }) => {
    this.setState(
      {
        // lockEarliestTime: true,
        earliestTime: time
      },
      () => {
        this.checkValidityTime();
        this.clearRequestFailText();
      }
    );
  };
  handleSelectLatestTime = ({ time }) => {
    this.setState(
      {
        // lockLatestTime: true,
        latestTime: time
      },
      () => {
        this.checkValidityTime();
        this.clearRequestFailText();
      }
    );
  };

  handleOnDatePick = d => {
    this.setState(
      {
        pickupDate: d
      },
      () => {
        this.clearRequestFailText();
      }
    );
  };

  handlePreferredLocation = pref => {
    this.setState(
      {
        preferredLocation: pref
      },
      () => {
        this.clearRequestFailText();
      }
    );
  };

  getRequiredFieldsErrors = () => {
    const {
      selectedAddressId,
      latestTime,
      earliestTime,
      pickupDate,
      invalidLatestTime
    } = this.state;

    const errors = [];

    if (!selectedAddressId) {
      errors.push("An address is required");
    }

    if (!latestTime) {
      errors.push("A latest pickup time is required");
    } else {
      if (invalidLatestTime) {
        errors.push("Pick a different pickup time");
      }
    }

    if (!earliestTime) {
      errors.push("An earliest pickup time is required");
    }

    if (!pickupDate) {
      errors.push("A pickup date is required");
    }

    var startTime = moment(earliestTime, "h:mm a");
    var endTime = moment(latestTime, "h:mm a");
    if (endTime.diff(startTime, 'minutes') < 120) {
      errors.push("At least a two hour window is required");
    }

    return errors;
  };

  handleConfirmPickup = async () => {
    if (this.state.isFetching) {
      return;
    }

    const incompletes = this.getRequiredFieldsErrors();

    if (incompletes.length > 0) {
      this.setState({
        showIncompleteFieldErrors: true
      });
      return;
    }

    try {
      this.setState({ isFetching: true });
      this.setState({ isFetching: false }); // TODO: Why set and then unset this?
      this.props.toggle(); //close the modal
    } catch (e) {
      if (e.response.status < 500) {
        this.setState({
          requestFailedText:
            e.response.data &&
            e.response.data.error &&
            e.response.data.error.message,
          isFetching: false
        });
      }
      this.setState({
        requestFailedText: "Something went wrong."
      });
    }
  };

  render() {
    const INVALID_TIME = "pick a different time";
    const {
      selectedAddressId,
      latestTime,
      earliestTime,
      pickupDate
    } = this.state;
    const isReadyToSubmit =
      selectedAddressId && latestTime && earliestTime && pickupDate;

    const isWeekday = date => {
      const day = date.day();
      return day !== 0 && day !== 6;
    };

    return (
      <React.Fragment>
        <div className="container">
          <div className="page-header">
            <div className="page-title">
              <h1 className="mb-1"> Schedule Pickup </h1>
            </div>
          </div>
        </div>

        <ErrorInfo invalidText={this.state.requestFailedText} />
        {this.state.showIncompleteFieldErrors && (
          <InputErrors errors={this.getRequiredFieldsErrors()} />
        )}
        <div class="container">
          <Container>
            <h3 class="m-0 mb-3 p-r">Date</h3>
            <DatePicker
              dateFormat={"MM / DD / YYYY"}
              selected={this.state.pickupDate}
              onChange={this.handleOnDatePick}
              minDate={moment().add(1, 'd')}
              filterDate = {isWeekday} 
              placeholderText="Click to pick a date"
              className={`form-control p-4 util-font-size-16`}
            />
          </Container>
          <Container>
            <TimeOnlyOptions
              title={"Earliest pickup time"}
              lock={false}
              placeholderText="Pick an earliest pickup time"
              data={genTimePoints(
                this.props.earliestTime,
                this.props.latestTime,
                60
              ).map(p => ({ time: p }))}
              onSelectTime={this.handleSelectEarliestTime}
            />
          </Container>
          <Container>
            <TimeOnlyOptions
              title={"Latest pickup time"}
              lock={false}
              placeholderText="Pick a latest pickup time"
              data={genTimePoints(
                this.state.earliestTime,
                this.props.latestTime,
                60
              ).map(p => ({ time: p }))}
              onSelectTime={this.handleSelectLatestTime}
              invalidText={this.state.invalidLatestTime && INVALID_TIME}
            />
          </Container>
          <Container>
            <AddressOptionsManaged
              title={"Pickup Address"}
              store={this.props.store}
            />
          </Container>
          <Container>
            <button
              class={`btn btn-main ${isReadyToSubmit ? "active" : "inactive"}`}
              onClick={this.handleConfirmPickup}
            >
              Confirm Pickup
            </button>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

SchedulePickup.defaultProps = {
  earliestTime: "9:00 AM",
  latestTime: "9:00 PM"
};

SchedulePickup.propTypes = {
  earliestTime: PropTypes.string.isRequired,
  latestTime: PropTypes.string.isRequired,
  onConfirmPickup: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  store: PropTypes.object.isRequired
};


class SchedulePickupModal extends Component {
  render() {
    return (
      <div>
        <SchedulePickup store={this.props.store} toggle={this.props.toggle} />
      </div>
    );
  }
}

export default connect("store")(SchedulePickupModal);
