
import React, { Component } from 'react';
import { Button, FormGroup, Input, ControlLabel, HelpBlock } from 'reactstrap';
import { connect } from '../utils'


class InviteFriends extends Component {
  constructor(props, context) {
    super(props, context);
    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
  }

  handleSignup() {
    this.modalStore.toggleSignup()
    this.routing.push('/main')
  }

  render() {
    return (
      <section className="page-section bg-fruitfull" style={{backgroundPositionY: '115px'}}>
        <div className="container-fluid">
          <div class="row">
            <div class="col-md-4">
              <h1 className="text-black">Shop package-free groceries</h1>
            </div>
            <div class="col-md-6">
              <div className="card">
                <h3 className="m-0 mb-2">Molly hooked you up with free delivery.</h3>
                <span className="mb-3">Sign up and get free delivery your first month.</span>
                <button className="btn btn-main mt-3 active" onClick={e=>this.handleSignup()}>SUBMIT</button>
              </div>
          </div>
        </div>
      </div>
    </section>
    );
  }
}

export default connect("store")(InviteFriends);
