import { Component } from 'react';

class DeliveryTimeOptions extends Component {
  state = {
    selectedDay: null,
    selectedDate: null,
    selectedTime: null,
    lockTime: false,
    confirmHome: false,
  }
  constructor(props) {
    super(props)
  }

  toggleTimeDropdown(e) {
    if (!this.state.lockAddress) {
      this.setState({addressError: true})
      return
    }

    this.setState({addressError: false})
    this.setState({timeDropdown: !this.state.timeDropdown})
  }

  hideTimeDropdown(e) {
    if (!this.state.timeDropdown) {
      return
    }

    this.setState({timeDropdown: false})
  }

  handleChangeTime(day, time, date, availability) {
    if (availability) {
      return
    }
    this.setState({selectedDay: day, selectedDate: date, selectedTime: time, lockTime: true, timeDropdown: false})
  }

  render() {
    const props = this.props
    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}

export default DeliveryTimeOptions

