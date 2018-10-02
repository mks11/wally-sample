import { Component } from 'react';

class DeliveryAddressOptions extends Component {
  state = {
    selectedAddress: null,
    lockAddress: false,
    addressError: false,
    invalidAddressText: '',
    invalidSelectAddress: '',
    invalidAddressText: '',
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

  handleSelectAddress(address_id) {
    this.setState({selectedAddress: address_id})
    if (address_id === '0') {
      this.setState({newAddress: true, newContactName: this.userStore.user.name, newPhoneNumber: this.userStore.user.primary_telephone})
    } else {
      this.setState({newAddress: false})
    }
  }

  handleSubmitAddress() {
    if (!this.state.selectedAddress) return
    this.setState({invalidSelectAddress: null})
    const address = this.userStore.user.addresses.find((d) => d._id === this.state.selectedAddress)
    let deliveryTimes = []
    this.checkoutStore.getDeliveryTimes({
      street_address: address.street_address,
      zip: address.zip,
    }, this.userStore.getHeaderAuth()).then((data) => {
      const times = data.delivery_windows
      for (var i = 0, len = times.length; i < len; i++) {
        addTimes(times[i])
      }

      this.setState({deliveryTimes, lockAddress: true, addressError: false})
    }).catch((e) => {
      console.log(e.response)
      if (e.response.data.error) {
        this.setState({invalidSelectAddress: e.response.data.error.message})
      }
      console.error(e)
    })

    function addTimes(data) {
      const timeFirst = data[0].split('-')[0]
      const day = moment(data[1] + ' ' + timeFirst).calendar(null,{
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
      })

      const findTime = deliveryTimes.findIndex((data) => data.day === day)

      const obj = {
        time: data[0],
        date: data[1],
        availability: data[2]
      }

      if (findTime === -1) {
        deliveryTimes.push({day: day, data: [obj]})
      } else {
        deliveryTimes[findTime].data.push(obj)
      }
    }
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

  render() {
    const props = this.props

    return (
      <React.Fragment>
        <h3 className="m-0 mb-3 p-r">
          Delivery address
          { this.state.lockAddress ? <a onClick={e => this.setState({lockAddress: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
        </h3>
        <div className={addressCardClass}>
          <div className={"card-body" + (this.state.lockAddress ? " lock" : "")}>
            { this.userStore.user.addresses.map((data, index) => {
              if (this.state.lockAddress && selectedAddress!=data.address_id) {
                return null
              }
              return (
                <div 
                  className={"custom-control custom-radio bb1" + (data.address_id === selectedAddress ? " active" : "")}
                  key={index}>
                  <input 
                    type="radio" id={"address-" + index} 
                    name="customRadio" 
                    checked={data.address_id === selectedAddress}
                    className="custom-control-input" 
                    value={data.address_id} 
                    onChange={e=>this.handleSelectAddress(data.address_id)} />
                  <label className="custom-control-label" htmlFor={"address-" + index} onClick={e=>this.handleSelectAddress(data.address_id)}>
                    {data.street_address} {data.unit}, {data.state} {data.zip}
                    <div className="address-phone">{data.name}, {data.telephone}</div>
                  </label>
                  {this.userStore.user.preferred_address === data.address_id &&
                      <a className="address-rbtn link-blue">DEFAULT</a>
                  }
                </div>)
            })}

            { !this.state.lockAddress ?  (
              <div>
                <div 
                  className={"custom-control custom-radio bb1" + ("0" === selectedAddress ? " active" : "")}
                >
                  <input type="radio" id="addressAdd" name="customRadio" className="custom-control-input" 
                    value="0" 
                    checked={selectedAddress === "0"}
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
                    <input type="checkbox" className="custom-control-input" id="customCheck1" onChange={e=>this.setState({newPreferedAddress: !this.state.newPreferedAddress})} />
                    <label className="custom-control-label" htmlFor="customCheck1">Make default address</label>
                  </div>
                  <hr />
                  <button className="btn btn-main active inline-round" onClick={e=>this.handleConfirmAddress(e)}>CONFIRM</button>
                  {this.state.invalidAddressText && <div className="error-msg">{this.state.invalidAddressText}</div>}
                </div>
              </div>
            ):null}
            {(!this.state.lockAddress && !this.state.newAddress) ? <button className="btn btn-main active" onClick={e => this.handleSubmitAddress(e)}>SUBMIT</button>:null}

            {this.state.invalidSelectAddress && <span className="text-error text-center d-block mt-3">{this.state.invalidSelectAddress}</span>}
          </div>
        </div>
        <h3 className="m-0 mb-3 p-r mt-5">Time 
          {this.state.lockTime ?  <a onClick={e => this.setState({lockTime: false, timeDropdown: true})} className="address-rbtn link-blue">CHANGE</a> : null}
          {this.state.addressError ?  <span className="address-rbtn text-error sm">Address required</span> : null}
        </h3>
        <div className="dropdown show">
          <ClickOutside onClickOutside={e=>this.hideTimeDropdown()}>
            <button onClick={e=>this.toggleTimeDropdown()} className="btn btn-dropdown-outline dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="true">
              {this.state.selectedTime ? <React.Fragment>{this.state.selectedDay}, {this.state.selectedTime}</React.Fragment> : 'Choose delivery date and time'}
            </button>
            <div className={timeDropdownClass}>
              {this.state.deliveryTimes.map((items, key) => (
                <React.Fragment key={key}>
                  <h6 className="dropdown-header">{items.day}</h6>
                  {items.data.map((item, key2) => ( 
                    <div className="dropdown-item" key={key2} onClick={e => this.handleChangeTime(items.day, item.time, item.date, item.availability)}  >
                      <div className="custom-control custom-radio">
                        <input 
                          checked={this.state.selectedDate === item.date && this.state.selectedTime === item.time}
                          type="radio" id={"date-time-"+ key2} name="timeRadio" className="custom-control-input" onChange={e => this.handleChangeTime(items.day, item.time, item.date, item.availability)} />
                        <label className="custom-control-label" >{item.time} {item.availability && <span className="text-muted">Not Available</span>}</label>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </ClickOutside>
        </div>
        <div className="custom-control custom-checkbox mt-2 mb-3">
          <input type="checkbox" className="custom-control-input" id="homeCheck" checked={this.state.confirmHome} onChange={e=>this.setState({confirmHome: !this.state.confirmHome})} />
          <label className="custom-control-label" onClick={e=>this.setState({confirmHome: !this.state.confirmHome})}>I confirm that I will be at home or have a doorman</label>
        </div>
        <h3 className="m-0 mb-3 p-r mt-5">Payment 
          { this.state.lockPayment ? <a onClick={e => this.setState({lockPayment: false})} className="address-rbtn link-blue pointer">CHANGE</a> : null}
        </h3>

        <div className="card1">
          <div className={"card-body" + (this.state.lockPayment ? " lock" : "")}>
            { this.userStore.user.payment.map((data, index) => {

              if (this.state.lockPayment && selectedPayment!=data._id) {
                return null
              }
              return (
                <div 
                  className={"custom-control custom-radio bb1" + (data._id === selectedPayment ? " active" : "")}
                  key={index}>
                  <input type="radio" id={"payment"+index}
                    value={data._id} 
                    checked={data._id === selectedPayment}
                    name="customRadio" className="custom-control-input"
                    onChange={e => this.handleSelectPayment(data._id)}
                  />
                  <label className="custom-control-label" htmlFor={"payment"+index} onClick={e=>this.handleSelectPayment(data._id)}>
                    <img src="images/card.png" /> *****{data.last4}
                  </label>
                  {this.userStore.user.preferred_payment === data._id &&
                      <a href="#" className="address-rbtn link-blue" style={{top:'10px'}}>DEFAULT</a>
                  }
                </div>
              )
            })}

            { !this.state.lockPayment ?  (
              <div>
                <div 
                  className={"custom-control custom-radio bb1" + ("0" === selectedPayment ? " active" : "")}
                >
                  <input type="radio" id="paymentAdd" name="customRadio" className="custom-control-input" 
                    value="0"
                    checked={selectedPayment === "0"}
                    onChange={e=>this.handleSelectPayment(selectedPayment)}/>
                  <label className="custom-control-label" htmlFor="paymentAdd" onClick={e=>this.handleSelectPayment('0')} >Add new card</label>
                </div>
                <div className={paymentFormClass}>
                  {/* 
                      <div className="row no-gutters">
                        <div className="col-md-4">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Card number" />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="MM/YY" />
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="CVV" />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <input type="text" className="form-control input1" placeholder="Zipcode" />
                          </div>
                        </div>
                      </div>
                      <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Make default payment method</label>
                      </div>
                      <hr />
                      <button className="btn btn-main active inline-round">CONFIRM</button>
                      <div className="error-msg d-none">Invalid card information</div>
                      */}

                      <StripeProvider apiKey={STRIPE_API_KEY}>
                        <Elements>
                          <CardSmall  addPayment={this.handleAddPayment} />
                        </Elements>
                      </StripeProvider>
                    </div>
                  </div>):null}
                  { (!this.state.lockPayment && !this.state.newPayment) && <button className="btn btn-main active" onClick={e => this.handleSubmitPayment(e)}>SUBMIT</button>}
                </div>
              </div>
            </React.Fragment>
    )
  }
}

export default DeliveryAddressOptions

