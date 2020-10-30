import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, {
  geocodeByAddress,
} from 'react-places-autocomplete';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Button, Card, Typography } from '@material-ui/core';
import AddressRadioItem from './AddressRadioItem';
import { Add } from '@material-ui/icons';

class AddressOptions extends Component {
  state = {
    error: false,
    newContactName: '',
    newPhoneNumber: '',
    selected: '',
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

  handleSelectAddress = (address_id) => {
    this.setState({ selected: address_id });
    if (address_id === '0') {
      // TODO handle the case here ...why are the following states here
      this.setState({
        newAddress: true,
        newContactName: this.props.user.name,
        newPhoneNumber: this.props.user.primary_telephone,
      });
    } else {
      const address = this.props.user.addresses.find(
        (d) => d._id === address_id,
      );
      this.props.onSelect && this.props.onSelect(address);
    }
  };

  handleSubmitAddress = () => {
    if (!this.state.selected) return;
    if (this.props.locking) {
      this.setState({ lock: true });
    } else {
      this.setState({ lock: false });
    }
    const address = this.props.user.addresses.find(
      (d) => d._id === this.state.selected,
    );
    this.props.onSubmit &&
      this.props.onSubmit(address).catch((e) => {
        if (e.response && e.response.data.error) {
          // this.setState({
          //   invalidSelectAddress: e.response.data.error.message,
          // });
          //TODO appropriate replacement of the commented out?
        }
        console.error(e);
      });
  };

  handleAddAddress = () => {
    //todo: when the component is changed to functional
  };

  unlock = () => {
    this.setState({ lock: false });
    this.props.onUnlock && this.props.onUnlock();
  };

  render() {
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
      <>
        {showTitle && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" gutterBottom>
              {this.props.title ? this.props.title : 'Delivery address'}
            </Typography>
            {lock && editable ? (
              <Button onClick={this.unlock}>
                <Typography variant="h6">CHANGE</Typography>
              </Button>
            ) : null}
          </Box>
        )}
        <Box mb={4}>
          <Card>
            <Box p={2}>
              <Box mb={2}>
                <PrimaryWallyButton onClick={this.handleAddAddress}>
                  <Add /> Add New Address
                </PrimaryWallyButton>
              </Box>
              {data.map((data, index) => {
                if (lock && selected !== data.address_id) {
                  return null;
                }
                return (
                  <AddressRadioItem
                    data={data}
                    key={data.address_id}
                    index={index}
                    selected={selected}
                    onChange={this.handleSelectAddress}
                    isPreferredAddress={preferred_address === data.address_id}
                  />
                );
              })}

              {showButton && !lock ? (
                <PrimaryWallyButton
                  className="btn btn-main active"
                  onClick={this.handleSubmitAddress}
                >
                  SUBMIT
                </PrimaryWallyButton>
              ) : null}
            </Box>
          </Card>
        </Box>
      </>
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
