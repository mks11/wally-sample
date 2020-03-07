import React, { Component } from "react";
import AddressOptions from "../../common/DeliveryAddressOptions";
import PropTypes from "prop-types";

export default class AddressOptionsManaged extends Component {
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
              : this.userStore.user.preferred_address
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
