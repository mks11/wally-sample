import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { logModalView, logEvent, genTimePoints, isValidTimeOrder } from "utils";
import PreferredPickup from "../common/DropdownPreferredPickupLocation";
import AddressOptions from "../common/DeliveryAddressOptions";
import CustomDatepicker from "../common/CustomDatepicker";
import { connect } from "utils";
import TimeOnlyOptions from "../common/TimeOnlyOptions";
import { FormGroup } from "reactstrap";

function Container(props) {
  return <div className="util-margin-top-20" {...props} />;
}

class AddressOptionsManaged extends Component {
  constructor(props) {
    super(props);
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;

    this.state = {
      selectedAddress: null,
      addressError: false,
      lockAddress: true,
      confirmHome: false,
      confirmHomeError: false,
      newAddress: false,
      invalidSelectAddress: "",
      invalidAddressText: "",
      newStreetAddress: "",
      newAptNo: "",
      newZip: "",
      newContactName: "",
      newPhoneNumber: "",
      newDeliveryNotes: "",
      newState: "",
      newCity: "",
      newCountry: "",
      newPreferedAddress: false
    };
  }

  componentDidMount() {
    this.userStore.getStatus(true).then(status => {
      if (status) {
        const selectedAddress =
          this.userStore.selectedDeliveryAddress ||
          (this.userStore.user
            ? this.userStore.getAddressById(
                this.userStore.user.preferred_address
              )
            : null);

        if (selectedAddress) {
          // INSTEAD
          // this.userStore.setDeliveryAddress(selectedAddress);
        }

        if (this.userStore.user.addresses.length > 0) {
          const selectedAddress = this.userStore.user.addresses.find(
            d => d._id === this.userStore.user.preferred_address
          );
          this.setState({ selectedAddress: selectedAddress._id });
        } else {
          this.setState({ lockAddress: false });
        }
      } else {
        this.routing.push("/main");
      }
    });
  }

  handleSelectAddress = data => {
    const selectedAddress = this.userStore.selectedDeliveryAddress;
    if (!selectedAddress || selectedAddress.address_id !== data.address_id) {
      this.setState({ selectedAddress: data, selectedAddressChanged: true });
      this.userStore.setDeliveryAddress(data);
    } else {
      this.setState({ selectedAddressChanged: false });
    }
  };

  handleSubmitAddress = async address => {
    this.userStore.setDeliveryAddress(address);
    this.setState({ lockAddress: true });
  };

  handleUnlockAddress = () => {
    this.setState({ lockAddress: false });
  };

  handleAddNewAddress = async data => {
    const {
      newContactName,
      newState,
      newDeliveryNotes,
      newZip,
      newAptNo,
      newCity,
      newCountry,
      newPhoneNumber,
      newStreetAddress,
      newPreferedAddress
    } = data;

    const dataMap = {
      name: newContactName,
      state: newState,
      delivery_notes: newDeliveryNotes,
      zip: newZip,
      unit: newAptNo,
      city: newCity,
      country: newCountry,
      telephone: newPhoneNumber,
      street_address: newStreetAddress,
      preferred_address: newPreferedAddress
    };

    const response = await this.userStore.saveAddress(dataMap);
    const address = this.userStore.selectedDeliveryAddress;
    this.userStore.setDeliveryAddress(address);
    this.setState({ lockAddress: true });
    return response;
  };

  render() {
    return (
      this.userStore.user && (
        <AddressOptions
          lock={this.state.lockAddress}
          editable={true}
          title={this.props.title}
          selected={
            this.userStore.selectedDeliveryAddress
              ? this.userStore.selectedDeliveryAddress.address_id
              : null
          }
          user={this.userStore.user}
          onAddNew={this.handleAddNewAddress}
          onSubmit={this.handleSubmitAddress}
          onSelect={this.handleSelectAddress}
          onUnlock={this.handleUnlockAddress}
          newAddressPlaceholder={"Pickup from ..."}
          addNewNotesPlaceholder={"Add pickup instructions ..."}
        />
      )
    );
  }
}

class SchedulePickup extends Component {
  constructor(props) {
    super(props);

    this.schedulePickupStore = this.props.store.schedulePickup;
    this.userStore = this.props.store.user;

    this.state = {
      timeDropdown: false,

      selectedAddress: null,

      earliestTime: this.props.earliestTime,
      latestTime: null,

      preferredLocation: "",

      lockEarliestTime: false,
      lockLatestTime: false,

      newAddress: false,

      addressError: false,

      invalidText: "",
      successText: "",

      invalidSelectAddress: "",
      invalidLatestTime: false,
      invalidEarliestTime: false,

      pickupDate: moment.now(),
      pickupNotes: ""
    };
  }

  componentDidMount() {}

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

  handleSelectEarliestTime = ({ time }) => {
    this.setState(
      {
        // lockEarliestTime: true,
        earliestTime: time
      },
      this.checkValidityTime
    );
  };
  handleSelectLatestTime = ({ time }) => {
    this.setState(
      {
        // lockLatestTime: true,
        latestTime: time
      },
      this.checkValidityTime
    );
  };

  handleOnDatePick = d => {
    this.setState({
      pickupDate: d
    });
  };

  handlePreferredLocation = pref => {
    this.setState({
      preferredLocation: pref
    });
  };

  handleConfirmPickup = () => {
    const {
      preferredLocation,
      latestTime,
      earliestTime,
      pickupDate
    } = this.state;

    const selectedAddress = this.userStore.selectedDeliveryAddress;

    this.schedulePickupStore.schedulePickup({
      address_id: selectedAddress.address_id,
      scheduled_date: pickupDate,
      earliest_time: earliestTime,
      latest_time: latestTime,
      pickup_notes: preferredLocation,
      auth: this.userStore.getHeaderAuth()
    });
  };

  render() {
    const INVALID_TIME = "pick a different time";
    const {
      preferredLocation,
      latestTime,
      earliestTime,
      pickupDate
    } = this.state;
    const isReadyToSubmit =
      preferredLocation && latestTime && earliestTime && pickupDate;

    return (
      <React.Fragment>
        <div class="container">
          <div class="page-header">
            <div class="page-title">
              <h1 class="mb-1"> Schedule Pickup </h1>
            </div>
          </div>
        </div>
        <div class="container">
          <Container>
            <h3 class="m-0 mb-3 p-r">Date</h3>
            <CustomDatepicker
              dateFormat={"MM / DD / YYYY"}
              selected={this.state.pickupDate}
              onDatePick={this.handleOnDatePick}
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
                30
              ).map(p => ({ time: p }))}
              onSelectTime={this.handleSelectEarliestTime}
              invalidText={this.state.invalidEarliestTime && INVALID_TIME}
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
                30
              ).map(p => ({ time: p }))}
              onSelectTime={this.handleSelectLatestTime}
              invalidText={this.state.invalidLatestTime && INVALID_TIME}
            />
          </Container>
          <Container>
            <AddressOptionsManaged
              store={this.props.store}
              title={"Pickup Address"}
            />
          </Container>
          <Container>
            <h3 class="m-0 mb-3 p-r"> Preferred Pickup Location </h3>
            <PreferredPickup
              selected={this.state.preferredLocation}
              handleSelected={this.handlePreferredLocation}
            />
          </Container>
          <Container>
            <button
              class={`btn btn-main ${isReadyToSubmit ? "active" : "inactive"}`}
              onClick={this.handleConfirmPickup}
            >
              {" "}
              Confirm Pickup{" "}
            </button>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

SchedulePickup.defaultProps = {
  earliestTime: "6:00 AM",
  latestTime: "11:00 PM"
};

SchedulePickup.propTypes = {
  earliestTime: PropTypes.string.isRequired,
  latestTime: PropTypes.string.isRequired,
  onConfirmPickup: PropTypes.func.isRequired
};

export default connect("store")(SchedulePickup);
