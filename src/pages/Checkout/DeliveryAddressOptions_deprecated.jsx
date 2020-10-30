import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';

class AddressOptions extends Component {
  state = {
    error: false,
    newStreetAddress: '',
    newAptNo: '',
    newZip: '',
    newContactName: '',
    newPhoneNumber: '',
    newDeliveryNotes: '',
    newState: '',
    newCity: '',
    newCountry: '',
    newPreferedAddress: false,
  };

  componentDidMount() {
    let selected = this.state.selected
      ? this.state.selected
      : this.props.selected;
    if (!selected) {
      selected = this.props.user.preferred_address;
    }

    this.setState({ selected });
  }

  handleSelectAddress(address_id) {
    this.setState({ selected: address_id });
    if (address_id === '0') {
      this.setState({
        newAddress: true,
        newContactName: this.props.user.name,
        newPhoneNumber: this.props.user.primary_telephone,
      });
    } else {
      this.setState({ newAddress: false });
      const address = this.props.user.addresses.find(
        (d) => d._id === address_id,
      );
      this.props.onSelect && this.props.onSelect(address);
    }
  }

  handleSubmitAddress = () => {
    if (!this.state.selected) return;
    if (this.props.locking) {
      this.setState({ invalidSelectAddress: null, lock: true });
    } else {
      this.setState({ invalidSelectAddress: null, lock: false });
    }
    const address = this.props.user.addresses.find(
      (d) => d._id === this.state.selected,
    );
    this.props.onSubmit &&
      this.props.onSubmit(address).catch((e) => {
        if (e.response && e.response.data.error) {
          this.setState({
            invalidSelectAddress: e.response.data.error.message,
          });
        }
        console.error(e);
      });
  };

  handleAddNewAddress = () => {
    this.setState({ invalidText: null });
    if (!this.state.newStreetAddress) {
      this.setState({ invalidText: 'Street address cannot be empty' });
      return;
    }

    if (!this.state.newContactName) {
      this.setState({ invalidText: 'Name cannot be empty' });
      return;
    }

    if (!this.state.newPhoneNumber) {
      this.setState({ invalidText: 'Telephone cannot be empty' });
      return;
    }

    this.props
      .onAddNew(this.state)
      .then((data) => {
        const lastAddress = data.addresses[data.addresses.length - 1];
        this.setState({
          selected: lastAddress.address_id,
          newAddress: false,
          invalidText: '',
          newStreetAddress: '',
          newAptNo: '',
          newZip: '',
          newContactName: '',
          newPhoneNumber: '',
          newDeliveryNotes: '',
          newState: '',
          newCity: '',
          newCountry: '',
          newPreferedAddress: false,
        });

        this.props.onSelect && this.props.onSelect(lastAddress);
      })
      .catch((e) => {
        if (e.response && e.response.data.error) {
          const msg = e.response.data.error.message;
          this.setState({ invalidText: msg });
        }
        console.error('Failed to save address', e);
      });
  };

  handleAddAddress = () => {
    //todo
  };

  fillInAddress(place) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      sublocality_level_1: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name',
    };

    let address = {};

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];

      // Brooklyn and other parts of New York City do not include the city as part of the address.
      // Instead, they use sublocality_level_1.
      var addressTypes = place.address_components[i].types;
      if (addressTypes.includes('sublocality_level_1')) {
        addressType = 'sublocality_level_1';
      }

      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        address[addressType] = val;
      }
    }

    let city = address.locality;
    if (!city && address.sublocality_level_1) {
      city = address.sublocality_level_1;
    }
    const state = address.administrative_area_level_1;
    const country = address.country;
    const zip = address.postal_code;

    const streetAddress = [address.street_number, address.route].join(' ');

    this.setState({
      newStreetAddress: streetAddress,
      newCity: city,
      newState: state,
      newCountry: country,
      newZip: zip,
    });
  }

  handleNewAddressChange = (newStreetAddress) => {
    this.setState({ newStreetAddress });
  };

  handleNewAddressSelect = (newStreetAddress) => {
    this.setState({ newStreetAddress });
    geocodeByAddress(newStreetAddress)
      .then((results) => {
        this.fillInAddress(results[0]);
      })
      .catch((error) => console.error('Error', error));
  };

  unlock = () => {
    this.setState({ lock: false });
    this.props.onUnlock && this.props.onUnlock();
  };

  render() {
    let addressFormClass = 'addAdressForm mb-4';
    if (!this.state.newAddress) {
      addressFormClass += ' d-none';
    }

    let addressCardClass = 'card1 delivery';
    if (this.state.error) {
      addressCardClass += ' error';
    }

    let selected = this.state.selected
      ? this.state.selected
      : this.props.selected;
    if (!selected) {
      selected = this.props.user.preferred_address;
    }
    const data = this.props.user ? this.props.user.addresses : [];
    const lock = this.state.lock ? this.state.lock : this.props.lock;
    const preferred_address = this.props.user
      ? this.props.user.preferred_address
      : null;
    const editable = this.props.editable !== null ? this.props.editable : true;

    const showTitle =
      typeof this.props.title !== 'undefined' ? this.props.title : true;
    const showButton =
      typeof this.props.button !== 'undefined' ? this.props.button : true;

    return (
      <React.Fragment>
        {showTitle && (
          <h3 className="m-0 mb-3 p-r">
            {this.props.title ? this.props.title : 'Delivery address'}
            {lock && editable ? (
              <a
                onClick={this.unlock}
                className="address-rbtn link-blue pointer"
              >
                CHANGE
              </a>
            ) : null}
          </h3>
        )}
        <div className={addressCardClass}>
          <div className={'card-body' + (lock ? ' lock' : '')}>
            <PrimaryWallyButton onClick={this.handleAddAddress}>
              Add New Address
            </PrimaryWallyButton>

            {data.map((data, index) => {
              if (lock && selected !== data.address_id) {
                return null;
              }
              return (
                <div
                  className={
                    'custom-control custom-radio bb1' +
                    (data.address_id === selected ? ' active' : '')
                  }
                  key={index}
                >
                  <input
                    type="radio"
                    id={'address-' + index}
                    name="customRadio"
                    checked={data.address_id === selected}
                    className="custom-control-input"
                    value={data.address_id}
                    onChange={(e) => this.handleSelectAddress(data.address_id)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={'address-' + index}
                    onClick={(e) => this.handleSelectAddress(data.address_id)}
                  >
                    {data.street_address} {data.unit}, {data.state} {data.zip}
                    <div className="address-phone">
                      {data.name}, {data.telephone}
                    </div>
                  </label>
                  {preferred_address === data.address_id && (
                    <a className="address-rbtn link-blue">DEFAULT</a>
                  )}
                </div>
              );
            })}

            <AddressCreateForm />

            {showButton && (
              <React.Fragment>
                {!lock && !this.state.newAddress ? (
                  <button
                    className="btn btn-main active"
                    onClick={(e) => this.handleSubmitAddress(e)}
                  >
                    SUBMIT
                  </button>
                ) : null}
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AddressOptions.defaultProps = {
  newAddressPlaceholder: 'Delivery to...',
  addNewNotesPlaceholder: 'Add delivery instructions',
};

AddressOptions.propTypes = {
  user: PropTypes.shape({
    preferred_address: PropTypes.string.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.any),
    name: PropTypes.string,
    primary_telephone: PropTypes.string,
  }),
  newAddressPlaceholder: PropTypes.string,
  onAddNew: PropTypes.func.isRequired,
  onUnlock: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selected: PropTypes.string,
  lock: PropTypes.bool,
  title: PropTypes.string,
  button: PropTypes.string,
  editable: PropTypes.bool,
};

export default AddressOptions;
