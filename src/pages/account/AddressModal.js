import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap';
import { connect } from '../../utils'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class AddressModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      address_id: null,
      street_address: '',
      city: '',
      state: '',
      country: '',
      address: '',
      unit: '',
      delivery_notes: '',
      name: '',
      telephone: '',
      default: false,
      preferred_address: false,
      zip: 0,
      address_id: 0,

      title: 'Add address',
      mode: 'add',
      invalidText: null,

      deleteConfirmation: false
    }


    this.userStore = this.props.store.user

    this.handleChange = this.handleChange.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

  }
  componentDidMount() {

    if (this.userStore.activeAddress) {
      const { address_id, name, state, delivery_notes, zip, unit, telephone, city, country, street_address} = this.userStore.activeAddress
      this.setState({
        address_id, name, state, delivery_notes, zip, unit, city, telephone,street_address,
        default: this.userStore.user.preferred_address === address_id,
        title: 'Edit address',
        mode: 'edit',
        address: street_address + ', ' + city + ', ' + country
      })
      return
    }

    // this.userStore.getStatus()
    //   .then((status) => {
    const user = this.userStore.user
    this.setState({
      name: user.name,
      telephone: user.primary_telephone,
      zip: user.signup_zip
    })
      // })
    // if (this.userStore.activeAddress) {
    //   const address = this.userStore.activeAddress
    //   this.setState({
    //     address: address.street_address,
    //     address_id: address.address_id,
    //     unit: address.unit,
    //     delivery_notes: address.delivery_notes,
    //     name: address.name,
    //     telephone: address.telephone,
    //     title: 'Edit address',
    //     mode: 'edit',
    //     default: this.userStore.user.preferred_address === address.address_id
    //   })
    // } else {
    //   this.setState({
    //     name: this.userStore.user.name,
    //     telephone: this.userStore.user.telephone,
    //   })
    // }
  }
  handleSubmit(e) {
    this.setState({invalidText: null})
    if (!this.state.street_address) {
      this.setState({invalidText: 'Street address cannot be empty'})
      return
    }

    if (!this.state.unit) {
      this.setState({invalidText: 'Unit cannot be empty'})
      return
    }

    if (!this.state.name) {
      this.setState({invalidText: 'Name cannot be empty'})
      return
    }

    if (!this.state.telephone) {
      this.setState({invalidText: 'Telephone cannot be empty'})
      return
    }

    // if (!this.state.delivery_notes) {
    //   this.setState({invalidText: 'Delivery notes cannot be empty'})
    //   return
    // }
    //
    const { name, state, delivery_notes, zip, unit, city, country, telephone, street_address, preferred_address} = this.state

    this.userStore.saveAddress({
      name, state, delivery_notes, zip, unit, city, country, telephone,street_address, preferred_address
    }).then((data) => {
      this.userStore.setUserData(data)
      this.userStore.hideAddressModal()
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to save address', e)
    })

    e.preventDefault()
  }

  handleMakeDefault() {
    if (this.state.default) {
      return
    }
    this.userStore.makeDefaultAddress(this.state.address_id).then((data) => {
      this.userStore.setUserData(data)
      this.userStore.hideAddressModal()
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to edit address', e)
    })
  }
  handleDeleteConfirm() {
    this.setState({
      deleteConfirmation: true
    })
  }
  handleDelete() {
    this.setState({deleteConfirmation: false})
    this.userStore.deleteAddress(this.state.address_id).then((data) => {
      this.userStore.setUserData(data)
      this.userStore.hideAddressModal()
    }).catch((e) => {
      const msg = e.response.data.error.message
      this.setState({invalidText: msg})
      console.error('Failed to delete address', e)
    })
  }

  fillInAddress(place) {
    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    let address = {}

    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        address[addressType] = val;
      }
    }
    console.log('adddres', address)

    let city = address.locality
    if (!city && address.administrative_area_level_1) {
      city = address.administrative_area_level_1
    }
    const state = address.administrative_area_level_1
    const country = address.country
    const zip = address.postal_code

    this.setState({city, state, country, zip})

  }

  handleChange(address) {
    this.setState({ address, street_address: address });
  }

  handleSelect(address) {
    this.setState({ address })
    geocodeByAddress(address)
      .then(results => {
        this.fillInAddress(results[0])
      })
      .catch(error => console.error('Error', error));
  };

  render() {
    let buttonClass = 'btn btn-main my-3'
    if (this.state.street_address && this.state.unit && this.state.name && this.state.telephone) {
      buttonClass += ' active'
    }
    return (
      <Modal isOpen={this.userStore.addressModal} className="modal-outline" onClosed={e=>this.userStore.closeAddressModal()}>
        <div className="modal-header">
          <h2>{this.state.title}</h2>
          <button className="btn-icon btn-icon--close" onClick={e => this.userStore.hideAddressModal()}></button>
        </div>
        <form onSubmit={e=>e.preventDefault()} autoComplete="off">
          <ModalBody>
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div style={{position:'relative'}}>
            <input
              {...getInputProps({
                autoComplete: 'off',
                placeholder: 'Delivery to...',
                className: 'aw-input--control aw-input--control-large aw-input--left location-search-input  aw-input--location aw-input--bordered mt-3 form-control',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>{' '}
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
            <Input
              className="aw-input--control aw-input--control-large aw-input--left "
              type="text"
              value={this.state.unit}
              placeholder="Apt number or company"
              onChange={(e) => this.setState({unit: e.target.value})}/>
            <FormGroup className="input-merged">

              <Input
                style={{width: '50%'}}
                className="aw-input--control aw-input--control-large aw-input--left "
                type="text"
                value={this.state.name}
                placeholder="Enter your name"
                onChange={(e) => this.setState({name: e.target.value})}/>
              <Input
                style={{width: '50%'}}
                className="aw-input--control aw-input--control-large aw-input--left "
                type="text"
                value={this.state.telephone}
                placeholder="Enter your telephone"
                onChange={(e) => this.setState({telephone: e.target.value})}/>

            </FormGroup>
            <textarea
              className="aw-input--control aw-input--control-large aw-input--left mt-3"
              placeholder="Add delivery instructions (e.g. “use callbox when you arrive”)"
              onChange={(e) => this.setState({delivery_notes: e.target.value})} value={this.state.delivery_notes}></textarea>
          </ModalBody>

          {this.state.default || this.state.mode === 'add' && (
            <ModalBody className="modal-body-bordertop">
              {this.state.default && <span className="text-blue">DEFAULT</span>}
              {this.state.mode === 'add' &&
                  <FormGroup check className="my-2">
                    <Label check>
                      <Input type="checkbox" onChange={e=>this.setState({preferred_address: !this.state.preferred_address})} />{' '}
                      Make default address
                    </Label>
                  </FormGroup>}

                </ModalBody>
          )}

          {this.state.mode === 'add' &&
              <ModalBody className="modal-body-bordertop">
                <button onClick={e => this.handleSubmit(e)} className={buttonClass}>SAVE</button>
                { this.state.invalidText ? <span className="text-error text-center text-block">{this.state.invalidText}</span>: null}
              </ModalBody>
              }

              { (this.state.mode === 'edit' && !this.state.deleteConfirmation)  &&  (
                <ModalBody className="modal-body-bordertop">
                  <div style={{display: 'flex',justifyContent: 'space-between'}}>
                    <button onClick={e=>this.handleDeleteConfirm(e)} 
                      className="btn btn-main my-3 white" style={{width: '40%'}}>DELETE</button>

                    <button onClick={e=>this.handleMakeDefault(e)}
                      className={"btn btn-main active my-3"+ (this.state.default ? " disabled": "")}
                      style={{width: '40%'}} >MAKE DEFAULT</button>
                  </div>

                  { this.state.invalidText ? <span className="text-error text-center text-block">{this.state.invalidText}</span>: null}

                </ModalBody>
              )}

              { this.state.deleteConfirmation ?  (
                <ModalBody className="modal-body-bordertop">
                  <button onClick={e=>this.handleDelete(e)} 
                    className="btn btn-main my-3 active">CONFIRM</button>
                  <span className="text-error text-center text-block">Are you sure want to delete this address?</span>
                </ModalBody>
              ): null}
            </form>
          </Modal>
    );
  }
}

export default connect("store")(AddressModal);
