import React, { Component } from 'react';
import { Button, FormGroup, Input, ControlLabel, HelpBlock } from 'reactstrap';
import { connect } from '../utils'


class OrderConfirmation extends Component {
  constructor(props, context) {
    super(props, context);
  }

  handleShopMore() {

  }

  render() {
     return (
      <section className="page-section bg-fruitfull">
          <div className="container-fluid">
            <div className="card">
              <h3 className="m-0 mb-2">Reset your password</h3>
              <span className="mb-5">Please enter and verify your new password.</span>
              <form>
                <Input
                  className="aw-input--control aw-input--bordered"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => this.setState({password: e.target.value})}/>
                <Input
                  className="aw-input--control aw-input--bordered mt-2"
                  type="password"
                  placeholder="Verify Password"
                  onChange={(e) => this.setState({password: e.target.value})}/>
                <button className="btn btn-main my-4">SUBMIT</button>
              </form>
            </div>
          </div>
      </section>
    );
  }
}

export default connect("store")(OrderConfirmation);
