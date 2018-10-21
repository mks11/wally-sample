import React, { Component } from 'react';
import moment from 'moment'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class DeliveryAddressOptions extends Component {
  state = {
    error: false,
    newStreetAddress: '',
    newAptNo: '',
    newZip: '',
    newContactName: '',
    newPhoneNumber: '',
    newDeliveryNotes:'',
    newState:'',
    newCity: '',
    newCountry: '',
    newPreferedAddress: false,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let selected = this.state.selected ? this.state.selected : this.props.selected
    if (!selected) {
      selected = this.props.user.preferred_address
    }

    this.setState({selected})
  }

  handleSelectAddress(address_id) {
    this.setState({selected: address_id})
    if (address_id === '0') {
      this.setState({newAddress: true, newContactName: this.props.user.name, newPhoneNumber: this.props.user.primary_telephone})
    } else {
      this.setState({newAddress: false})
      const address = this.props.user.addresses.find((d) => d._id === address_id)
      this.props.onSelect && this.props.onSelect(address)
    }
  }

  handleSubmitAddress = () => {
    if (!this.state.selected) return
    if (this.props.locking) {
      this.setState({invalidSelectAddress: null, lock: true})
    } else {
      this.setState({invalidSelectAddress: null, lock: false})
    }
    const address = this.props.user.addresses.find((d) => d._id === this.state.selected)
    this.props.onSubmit && this.props.onSubmit(address).catch((e) => {
      if (e.response && e.response.data.error) {
        this.setState({invalidSelectAddress: e.response.data.error.message})
      }
      console.error(e)
    })
  }

  handleAddNewAddress = () => {

    console.log('newpreffered address', this.state.newPreferedAddress)
    this.setState({invalidText: null})
    if (!this.state.newStreetAddress) {
      this.setState({invalidText: 'Street address cannot be empty'})
      return
    }

    if (!this.state.newContactName) {
      this.setState({invalidText: 'Name cannot be empty'})
      return
    }

    if (!this.state.newPhoneNumber) {
      this.setState({invalidText: 'Telephone cannot be empty'})
      return
    }


    this.props.onAddNew(this.state).then((data) => {
      const lastAddress = data.addresses[data.addresses.length - 1]
      this.setState({
        selected: lastAddress.address_id,
        newAddress: false,
        invalidText: '',
        newStreetAddress: '',
        newAptNo: '',
        newZip: '',
        newContactName: '',
        newPhoneNumber: '',
        newDeliveryNotes:'',
        newState:'',
        newCity: '',
        newCountry: '',
        newPreferedAddress: false
      })

    }).catch((e) => {
      if (e.response && e.response.data.error) {
        const msg = e.response.data.error.message
        this.setState({invalidText: msg})
      }
      console.error('Failed to save address', e)
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

    this.setState({newCity: city, newState: state, newCountry: country, newZip: zip})
  }

  handleNewAddressChange = (newStreetAddress) => {
    this.setState({ newStreetAddress });
  }

  handleNewAddressSelect = (newStreetAddress) => {
    this.setState({ newStreetAddress })
    geocodeByAddress(newStreetAddress)
      .then(results => {
        // console.log(results[0])
        this.fillInAddress(results[0])
      })
      .catch(error => console.error('Error', error));
  }

  unlock = () => {
    this.setState({lock: false})
    this.props.onUnlock()
  }


  render() {
    const props = this.props

    let addressFormClass = 'addAdressForm mb-4'
    if (!this.state.newAddress) {
      addressFormClass += ' d-none'
    }

    let addressCardClass = 'card1 delivery'
    if (this.state.error) {
      addressCardClass += ' error'
    }

    let selected = this.state.selected ? this.state.selected : this.props.selected
    if (!selected) {
      selected = this.props.user.preferred_address
    }
    const data = this.props.user ? this.props.user.addresses : []
    const lock = this.state.lock ? this.state.lock : this.props.lock
    const preferred_address = this.props.user ? this.props.user.preferred_address : null
    const editable = this.props.editable !== null ? this.props.editable : true

    const showTitle = typeof this.props.title !== 'undefined' ? this.props.title : true
    const showButton = typeof this.props.button !== 'undefined' ? this.props.button : true


    return (
      <React.Fragment>
        {showTitle && <h3 className="m-0 mb-3 p-r">
          Delivery address
          { (lock && editable) ? <a onClick={this.unlock} className="address-rbtn link-blue pointer">CHANGE</a> : null}
        </h3>
        }
        <div className={addressCardClass}>
          <div className={"card-body" + (lock ? " lock" : "")}>
            { data.map((data, index) => {
              if (lock && selected!=data.address_id) {
                return null
              }
              return (
                <div 
                  className={"custom-control custom-radio bb1" + (data.address_id === selected ? " active" : "")}
                  key={index}>
                  <input 
                    type="radio" id={"address-" + index} 
                    name="customRadio" 
                    checked={data.address_id === selected}
                    className="custom-control-input" 
                    value={data.address_id} 
                    onChange={e=>this.handleSelectAddress(data.address_id)} />
                  <label className="custom-control-label" htmlFor={"address-" + index} onClick={e=>this.handleSelectAddress(data.address_id)}>
                    {data.street_address} {data.unit}, {data.state} {data.zip}
                    <div className="address-phone">{data.name}, {data.telephone}</div>
                  </label>
                  {preferred_address === data.address_id &&
                      <a className="address-rbtn link-blue">DEFAULT</a>
                  }
                </div>)
            })}

            { !lock ?  (
              <div>
                <div 
                  className={"custom-control custom-radio bb1" + ("0" === selected ? " active" : "")}
                >
                  <input type="radio" id="addressAdd" name="customRadio" className="custom-control-input" 
                    value="0" 
                    checked={selected === "0"}
                    onChange={e=>this.handleSelectAddress('0')}/>
                  <label className="custom-control-label" htmlFor="addressAdd" onClick={e=>this.handleSelectAddress('0')}>Add new address</label>
                </div>
                <div className={addressFormClass}>
                  <PlacesAutocomplete
                    value={this.state.newStreetAddress}
                    onChange={this.handleNewAddressChange}
                    onSelect={this.handleNewAddressSelect}
                  >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div style={{position:'relative'}}>
                        <input
                          {...getInputProps({
                            autoComplete: 'off',
                            placeholder: 'Delivery to...',
                            className: 'aw-input--control aw-input--small  aw-input--left location-search-input  aw-input--location mt-3 form-control',
                          })}
                        />
                        <div className={"autocomplete-dropdown-container" + (suggestions.length > 0 ? '' : ' d-none') }>
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
                  <div className="row mt-3">
                    <div className="col-md-7">
                      <div className="form-group">
                        <input 
                          value={this.state.newAptNo}
                          onChange={e=>this.setState({newAptNo: e.target.value})}
                          type="text" className="form-control input1" placeholder="Apt number" />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <input 
                          value={this.state.newZip}
                          onChange={e=>this.setState({newZip: e.target.value})}
                          type="text" className="form-control input1" placeholder="Zip code" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-7">
                      <div className="form-group">
                        <input
                          value={this.state.newContactName}
                          onChange={e=>this.setState({newContactName: e.target.value})}
                          type="text" className="form-control input1" placeholder="Contact Name" />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <input
                          value={this.state.newPhoneNumber}
                          onChange={e=>this.setState({newPhoneNumber: e.target.value})}
                          type="text" className="form-control input1" placeholder="Phone Number" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea
                      value={this.state.newDeliveryNotes}
                      onChange={e=>this.setState({newDeliveryNotes: e.target.value})}
                      className="form-control input2" rows="3" placeholder="Add delivery instructions"></textarea>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" checked={this.state.newPreferedAddress} onChange={e=>this.setState({newPreferedAddress: !this.state.newPreferedAddress})} />
                    <label className="custom-control-label"
                      onClick={e=>this.setState({newPreferedAddress: !this.state.newPreferedAddress})} 
                    >Make default address</label>
                  </div>
                  <hr />
                  <button className="btn btn-main active inline-round" onClick={this.handleAddNewAddress}>CONFIRM</button>
                  {this.state.invalidText && <div className="error-msg">{this.state.invalidText}</div>}
                </div>
              </div>
            ):null}

            {showButton && 
                <React.Fragment>
                  {(!lock && !this.state.newAddress) ? <button className="btn btn-main active" onClick={e => this.handleSubmitAddress(e)}>SUBMIT</button>:null}
                </React.Fragment>
            }

            {this.state.invalidSelectAddress && <span className="text-error text-center d-block mt-3">{this.state.invalidSelectAddress}</span>}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DeliveryAddressOptions

