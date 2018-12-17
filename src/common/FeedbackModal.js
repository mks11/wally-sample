import React, { Component } from 'react';
import {
  Modal,
  ModalBody,
  Input,
  FormGroup,
  Label,
  Col,
  Button,
} from 'reactstrap';
import { connect } from '../utils'

class FeedbackModal extends Component {
  constructor(props) {
    super(props)

    this.modalStore = this.props.store.modal
    this.routing = this.props.store.routing
    this.userStore = this.props.store.user

    this.state = {
      feedbackValue: 0,
      feedbackMsg: '',
      feedbackEmail: '',
      feedbackOrder: null,
    }
  }

  componentDidMount() {
    if (this.userStore.feedback) {
      const {
        email,
        value,
        order,
      } = this.userStore.feedback

      this.setState({
        feedbackValue: parseInt(value),
        feedbackEmail: email,
        feedbackOrder: order,
      })
    }
  }

  handleFeedbackValueChange = value => {
    this.setState({ feedbackValue: value })
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value.toString(),
    })
  }

  handleSubmit(e) {
    const {
      feedbackValue,
      feedbackEmail,
      feedbackOrder,
      feedbackMsg,
    } = this.state

    if (feedbackValue && feedbackEmail && feedbackOrder) {
      const feedback = {
        feedbackValue,
        feedbackEmail,
        feedbackOrder,
        feedbackMsg,
      }
      
      console.log(feedback)
      // this.modalStore.toggleFeedback()
    }
    e.preventDefault()
  }

  render() {
    const {
      feedbackValue
    } = this.state

    return (
      <Modal isOpen={this.modalStore.feedback} contentClassName="modal-bg-pinneapple-bottom">
        <div className="modal-header modal-header--sm">
          <div></div>
          <button className="btn-icon btn-icon--close" onClick={e => this.modalStore.toggleFeedback(e)}></button>
        </div>
        <ModalBody className="modal-body-no-footer feedback-modal">
          <div className="login-wrap pb-5">
            <h3 className="m-0 mb-2">How did we do?</h3>
            <FormGroup row>
              <Col sm={4}>
                <Button
                  className={`${feedbackValue === 0 ? 'active' : ''}`}
                  onClick={() => this.handleFeedbackValueChange(0)}
                >0</Button>
              </Col>
              <Col sm={4}>
                <Button
                  className={`${feedbackValue === 1 ? 'active' : ''}`}
                  onClick={() => this.handleFeedbackValueChange(1)}
                >1</Button>
              </Col>
              <Col sm={4}>
                <Button
                  className={`${feedbackValue === 2 ? 'active' : ''}`}
                  onClick={() => this.handleFeedbackValueChange(2)}
                >2</Button>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="feedbackMsg" sm={12}>Please leave your feedback below</Label>
              <Col sm={12}>
                <Input
                  type="textarea"
                  name="feedbackMsg"
                  id="feedbackMsg"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <button className="btn btn-main active" onClick={e => this.handleSubmit(e)}>Submit Feedback</button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default connect("store")(FeedbackModal);
